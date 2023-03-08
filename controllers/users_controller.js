var User = require("../models/user.js");
var jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY3);
async function getUserInfo(request) {
  return User.findOne({ email: request.email }, function (err, user) {
    if (err) {
      console.log("err", err);
      return err;
    }

    if (user == null) {
      return;
    }
  }).then((user) => {
    return user;
  });
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWTSECRET,
    {
      expiresIn: "1d", // in seconds
      algorithm: "HS256",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWTSECRET2 + user.password, {
    expiresIn: "7d", // in seconds
    algorithm: "HS256",
  });
}

module.exports = {
  getAllUsers(req, res, next) {
    User.find().then((users) => {
      console.log(
        `Logged in user ID is ${req.user_id} & It's role is ${req.user_role} & email is ${req.user_email}`
      );
      res.send(users);
    });
  },

  edit(req, res, next) {
    const userId = req.params.id;
    const userProps = req.body;

    User.findByIdAndUpdate({ _id: userId }, userProps)
      .then((user) => User.findById({ _id: userId }))
      .then((user) => res.send(user))
      .catch(next);
  },

  getUserDetailsById(req, res, next) {
    User.findOne({ _id: req.body.id }, (err, user) => {
      if (user == undefined) {
        return res
          .status(404)
          .send({ data: "", message: "User not found", status: false });
      }
      return res
        .status(200)
        .send({ data: user, message: "User get successfuly", status: true });
    });
  },

  delete(req, res, next) {
    const userId = req.params.id;
    User.findByIdAndRemove({ _id: userId })
      .then((user) => res.status(204).send(user))
      .catch(next);
  },

  async login(req, res, next) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user == undefined) {
        return res.status(404).send({ message: "Could not find user" });
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          console.log("there was an error:", err);
        }
        if (isMatch == true) {
          let token = `${generateToken(user)}`;
          let refreshToken = generateRefreshToken(user);

          if ("password" in user) delete user.password;
          console.log("user", user);
          return res.status(200).send({
            token: token,
            refreshToken: refreshToken,
            user: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              employer: user.employer,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              patients: user.patients,
            },
          });
        } else {
          return res.status(401).send({ message: "Incorrect password" });
        }
      });
    });
    // .populate({ path: "patients", model: "User" })
    // .exec(function (err, user) {
    //   console.log("user", user);
    //   if (err) {
    //     console.log("error", err);
    //   }

    // });
    // .catch((err) => {
    //   if("password" in err) delete err.password;
    //   console.log('error is', err)
    //   let logData = {status: err.code, email: req.body.email, other: err}
    //   // addLogServerSide(JSON.stringify(logData)).then(() => { // add log of failure
    //     console.log(`log data here: ${JSON.stringify(logData)}`)
    //   // }).catch(err => {
    //   //   console.error(err);
    //   // })
    // })
  },
  register(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || "THERAPIST";
    console.log('Registration Called.', req.body)
    // Return error if no email provided
    if (!email) {
      return res
        .status(422)
        .send({ message: "You must enter an email address." });
    }

    // Return error if no password provided
    if (!password) {
      return res.status(422).send({ message: "You must enter a password." });
    }

    User.findOne({ email }, (err, existingUser) => {
      if (err) {
        return next(err);
      }

      // If user is not unique, return error
      if (existingUser) {
        return res
          .status(422)
          .send({ message: "That email address is already in use." });
      }

      // If email is unique and password was provided, create account
      const user = new User({
        email,
        password,
        role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      user.save(async (err, user) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "could not create", error: err });
        }
        // Respond with JWT if user was created
        const msg = {
          to: user.email,
          from: {email: `platform@canvaspad.org`, name: 'CanvasPad'},
          subject: `Welcome To CanvasPad!`,
          text: `Thank you for joining us. We're so happy you're here. CanvasPad was created to help support you and your clients between sessions. CanvasPad is not a replacement for therapy or scheduled sessions. It is a tool for following up on next steps or homework. \n\n Depending on what makes sense for your treatment, you can send you a “treat yourself reminder”, “an observational flow” or a “directional flow”. \n\n “Use “Treat Yourself” to send your client a quick reminder linked to a goal discussed in your session. Here are some examples: Here are some examples: \n
          Make an appointment with your primary care physician \n
          Increase your water intake. Set alarms throughout the day for water\n
          Practice mindful breathing for 2 minutes a day \n
          Park bench your thoughts two hours before bed \n \n
          Use the “Observational Flow” to observe with your client emotions, physiological responses, and thoughts over time. Identify the goal for the week with regard to what you would like them to observe. Set a timer for when they can share their observations with you. Receive feedback from your client via e-mail. As you track their mindful observations, you will be collecting data that will provide evidence of next steps that can be taken for intervention. \n \n The “Directional Flow” will identify next steps based on what was observed in the “observational flow. The directional flow gives you as a provider the ability to identify an intervention that makes sense based on observations made by you and your client.\n
          Identify a direction you would like your client to follow for the week. \n
          Set a timer, if needed, in order for your client to practice a skill. \n
          Your client will be prompted to provide feedback (e.g. emotions, physiological response, thoughts).\n
          The feedback you receive from your client will help you decide if the direction makes sense, if there is more practice needed, or if a new direction is needed. \n
          Here are some examples:\n
          After your park bench your thoughts, practice breathing techniques in bed
          Clinician can set timer for client to provide feedback the following morning \n
          Practice engaging in time limited focused task for challenging work tasks (i.e. reading memo’s, reading articles. 5 minutes on 5 minutes off 5 minutes on… for 20 minutes \n
          Because your observational flow shows higher levels of stress experienced in the afternoon, practice mindful breathing at 12 noon for 2 minutes`
          ,
        };
        try {
        sgMail
          .send(msg)
          .then(() => {
            console.log('done!')
            return res.status(200);
          })
          .catch(error => {
            const {message, code, response} = error;
            const {headers, body} = response;
            console.error(body)
            return res.state(422).send({error: body, message: 'Something went wrong while trying to reset your password. Please contact support.'})
          })

        } catch(err) {
          console.log('error sending message', err)
        }
        res.status(200).json({
          token: `JWT ${generateToken(user)}`,
          refreshToken: generateRefreshToken(user),
          user: user,
        });
        // }
      });
    });
  },
};
