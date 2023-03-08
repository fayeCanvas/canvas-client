const PatientProfile = require('../models/PatientProfile');
const mongoose = require('mongoose');

module.exports = {
  read(req, res, next) {
    PatientProfile.find({}).then(
      profile => {
        res.send(profile)
      }
    )
  },
  create(req, res, next) {
    const props = req.body
    PatientProfile.create(props)
      .then((profile) => {
        res.send(profile)
      })
      .catch(next)
  },
  show(req, res, next) {
    const profileID = req.params.id
    PatientProfile.find({user: profileID})
      .populate({path: 'user', model: "User"})
      .exec(function(err, profile) {
        if (err) {console.log('error', err)}
        console.log('profile', profile)
        if(profile.length == 0) {
          PatientProfile.create({user: profileID})
            .then((profile) => {
              res.status(200).send(profile)
            })
            .catch(next)
        } else {

          res.send(profile)
        }
      })
  },
  edit(req, res, next) {
    const profileID = req.params.id
    const props = req.body
    const email = req.body.email;
    const userID = req.body.user
    PatientProfile.findOne({ user: userID }, (err, existingprofile) => {
      console.log('existingprofile', existingprofile)
      if (err || existingprofile == null) {
        console.log('err?', err)
        props.user = userID
        PatientProfile.create(props)
        // .populate({path: 'user', model: "User"})
        .then(function(err, profile) {
          if(err) {console.log('err', err)}
          console.log('profile', profile)
          res.send(profile)
        })
      }
      PatientProfile.findByIdAndUpdate({_id: existingprofile._id}, props, {new: true})
      .populate({path: 'user', model: "User"})
      .exec(function(err, profile) {
        if(err) {console.log('err', err)}
        console.log('profile2', profile)

        res.send(profile)
      })
    })

  },
  delete(req, res, next) {
    const profileID = req.params.id;
    PatientProfile.findByIdAndRemove({_id: profileID})
      .then((profile) => res.status(204).send(profile))
      .catch(next)
  },
}
