const User = require("../models/user");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY3);
const { generateRandomPassword } = require("../utils/randomPassword");

const {ObjectId} = require('mongodb');

const addPatient = async (req, res, next) => {
  console.log("------addPatient--req.user_role------", req.body);
  // if (req.user_role !== "THERAPIST") {
    if (req.body.role !== "PATIENT") {
    res.status(401).json({
      data: "",
      message: "you have not authority to add patient with this role",
      status: false,
    });
  }

  if (!req.body.firstName || !req.body.lastName) {
    res.status(404).json({
      data: "",
      message: "first name & last name are required",
      status: false,
    });
  }
  const email = req.body.email;


  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(409).json({
        data: "",
        message: "That email address is already in use.",
        status: false,
      });
    }
  })

    //const password = generateRandomPassword(8);
    //console.log(`random generated password is ${password}`);

    const user = new User({
      email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      createdById: req.user_id,
      role: "PATIENT",
    });

    console.log("-------user--------------", user);
    console.log("-------req.params.id--------------", req.params.id);

    const createdById = user.createdById;
    const patientId = user._id;
    // console.log("=========createdById----------patientId================", patientId, createdById);

    // new code is added
    user.save((err, user) => {
      if (err) {
        return res
          .status(404)
          .json({ data: "", message: "Something went wrong.", status: false });
      }
      res.status(201).json({
        data: user,
        message: "Patient created successfully",
        status: true,
      });
    });

    let therapist = await User.findOneAndUpdate({ _id : ObjectId(createdById)}, { $push: {"patients":patientId}}, { new: true})
    const msg = {
      to: user.email,
      from: {email: `platform@canvaspad.org`, name: 'CanvasPad'},
      subject: `You've been invited to CanvasPad!`,
      text: `You and your provider have agreed to utilize CanvasPad to help support treatment goals you are working on in between sessions. CanvasPad is not a replacement for therapy or scheduled sessions. It is a tool for following up on next steps or homework. \n\n Depending on what makes sense for your treatment, your clinician will either send you a “treat yourself reminder”, “an observational flow” or a “directional flow”. \n\n A “Treat Yourself” message is a quick reminder linked to a goal discussed in your session. Here are some examples: \n
Make an appointment with your primary care physician \n
Increase your water intake. Set alarms throughout the day for water\n
Practice mindful breathing for 2 minutes a day \n
Park bench your thoughts two hours before bed \n \n
The “Observational Flow” helps you observe your emotions, physiological responses, and thoughts over time. You and your clinician with identify a goal for the week with regard to what you should observe. A timer might be set for when observations can be shared with your clinician. You will send your responses and feedback by clicking send to your clinician. This will help give you and your provider insight to your experiences throughout the week and will provide evidence of next steps that can be taken for intervention. \n \n The “Directional Flow” will identify next steps based on what was observed in the “observational flow. The directional flow gives you and your provider the ability to identify an intervention that makes sense based on observations made with the help of the observational flow.\n
A direction will be identified for you to follow for the week. \n
A timer will be set, if needed, in order for you to practice a skill. \n
You will be prompted to provide feedback (e.g. emotions, physiological response, thoughts).\n
Press send and your provider will receive your response`
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
}

const deletePatient = async (req,res,next) => {
    if (!req.params.id) {res.status(400).json({data: '', message : 'patient Id must required', status: false})}

        const updatedEntity = await User.findOneAndUpdate({_id: req.params.id}, {isArchived: true}, {
            new: true
          });

        if (!updatedEntity) {res.status(404).json({data: '', message : 'something went wrong', status: false})}
        res.status(200).json({data: updatedEntity, message : 'patient updated successfully', status: true})
}

const getAllPatients = async (req,res) => {
    User.find({_id: req.params.id})
    .populate({path:'patients', model: "User"})
    .exec(function (err, user) {
      if (err) {console.log('error', err)}
      console.log('user', user)
      res.status(200).json({data: user, message : 'patients found successfully', status: true});
    })

};

const getAllPatients2 = async (req, res) => {
  User.find({ createdById: req.user_id }, function (err, users) {
    if (err) {
      res
        .status(400)
        .json({ data: "", message: "something went wrong", status: false });
    }

    res.status(200).json({
      data: users,
      message: "patients found successfully",
      status: true,
    });
  });
};

const getUserDetailsById = async (req, res) => {
  await User.find({ _id: req.params.id }, function (err, users) {
    if (err) {
      res
        .status(400)
        .json({ data: "", message: "something went wrong", status: false });
    }
    console.log('user', users)
    res.status(200).json({
      data: users,
      message: "user found successfully",
      status: true,
    });
  });
};

module.exports = {
  addPatient,
  deletePatient,
  getAllPatients,
  getUserDetailsById,
};
