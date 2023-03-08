const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./sendgrid_controller');
const crypto = require('crypto')
const CLIENT_ROOT = require('../helpers').CLIENT_ROOT
//import sgMail?
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY2);


exports.forgotPassword = function (req, res, next) {
  const email = req.body.email;

  User.findOne({ email }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      res.status(422).send({ error: 'Hmm we can not find that member in our system. Did you use your work email? Please try again. If you continue to have issues, please notify your expert.' });
      return next(err);
    }

    crypto.randomBytes(48, (err, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err) { return next(err); }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      existingUser.save((err) => {
          // If error in saving token, return it
          if (err || existingUser == null) {
            res.status(422).send({ error: 'Your request could not be processed as entered. Please try again.' });
            return next(err);
          }

        const msg = {
          to: existingUser.email,
          from: {email: `platform@canvaspad.org`, name: 'CanvasPad'},
          subject: 'Reset CanvasPad Password',
          text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              ''}${CLIENT_ROOT}/resetpassword/${resetToken}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged. \n`
          ,
        };
        sgMail
          .send(msg)
          .then(() => {
            return res.status(200).send({ message: `Please check your email for the link to reset your password. The link: ${CLIENT_ROOT}/resetpassword/${resetToken}` });
          })
          .catch(error => {
            const {message, code, response} = error;
            const {headers, body} = response;
            console.error(body)
            return res.state(422).send({error: body, message: 'Something went wrong while trying to reset your password. Please contact support.'})
          })
      });
    });
  });
};

exports.verifyToken = function (req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      return res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
    }

    resetUser.password = req.body.password;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save((err) => {
      if (err) { return next(err); }

        // If password change saved successfully, alert user via email
      const message = {
        to: resetUser.email,
        from: {email: 'platform@canvaspad', name: 'CanvasPad'},
        subject: 'Password Changed',
        text: 'You are receiving this email because you changed your password. \n\n' +
          'If you did not request this change, please contact us immediately.',
          html: `<p>You are receiving this email because you changed your password. \n\n' +
            'If you did not request this change, please contact us immediately.</p>`
      };
        sendEmail(message)
        // Otherwise, send user email confirmation of password change via Mailgun
      // mailgun.sendEmail(resetUser.email, message);

      return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
    });
  });
};
