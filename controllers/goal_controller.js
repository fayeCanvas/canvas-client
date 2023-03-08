const Goal = require("../models/goal");
const Notification = require("../models/notification")
const goalQuestion = require("../models/goalQuestion");
const moment = require('moment')

const seedQuestions = async (goalId, goalType, questions) => {
  let observational = [
    { question: "What are your thoughts?", answer: "", goalId: goalId },
    { question: "What did you do?", answer: "", goalId: goalId },
    // {
    //   question: "How do you feel from a scale of 0-10?",
    //   answer: "",
    //   goalId: goalId,
    // },
    {
      question:"What emotions are you experiencing?",
      answer: "",
      goalId: goalId
    },
    { question: "How did your body feel?", answer: "", goalId: goalId },
    {
      question:"What physical sensations are you experiencing?",
      answer: "",
      goalId: goalId
    },
  ];

  let directive = [
    // {
    //   question: "How do you feel from a scale of 0-10?",
    //   answer: "",
    //   goalId: goalId,
    // },
    { question: "How does your body feel?", answer: "", goalId: goalId },
    {
      question:"What emotions are you experiencing?",
      answer: "",
      goalId: goalId
    },
    {
      question:"What physical sensations are you experiencing?",
      answer: "",
      goalId: goalId
    },
    {
      question:
        "Do you have any additional observations that you'd like to share?",
      answer: "",
      goalId: goalId,
    },
  ];

  let observationalAndDirective = [
    { question: "What are your thoughts", answer: "", goalId: goalId },
    { question: "What did you do", answer: "", goalId: goalId },
    {
      question: "How do you feel from a scale of 0-10",
      answer: "",
      goalId: goalId,
    },
    { question: "How did your body feel", answer: "", goalId: goalId },
    {
      question: "How do you feel from a scale of 0-10",
      answer: "",
      goalId: goalId,
    },
    { question: "How does your body feel", answer: "", goalId: goalId },
    {
      question:
        "Do you have any additional observations that you'd like to share",
      answer: "",
      goalId: goalId,
    },
  ];

  if (goalType === "Observational") {
    if (questions.length > 0) {
      let mergedObservational = [...observational, ...questions];
      observational = mergedObservational.map((item) => {
        if (
          item.goalId === 0 ||
          item.goalId == null ||
          item.goalId == undefined
        ) {
          return { ...item, goalId: goalId };
        }
        return item;
      });

    }
    await goalQuestion.insertMany(observational);

  } else if (goalType === "Directive" ) {
    if (questions.length >0) {
      let mergedDirective = [...directive, ...questions];
      directive = mergedDirective.map((item) => {
        if (
          item.goalId === 0 ||
          item.goalId == null ||
          item.goalId == undefined
        ) {
          return { ...item, goalId: goalId };
        }
        return item;
      });
    }
    await goalQuestion.insertMany(directive);
  } else if (goalType === "ObservationalAndDirective" && questions.length > 0) {
    let mergedObsAndDir = [...observationalAndDirective, ...questions];
    observationalAndDirective = mergedObsAndDir.map((item) => {
      if (
        item.goalId === 0 ||
        item.goalId == null ||
        item.goalId == undefined
      ) {
        return { ...item, goalId: goalId };
      }
      return item;
    });
    await goalQuestion.insertMany(observationalAndDirective);
  }
};

const addGoal = async (req, res) => {
  console.log('Add Goal Req:', req.body)
  if (!req.body) {
    res
      .status(404)
      .json({ data: "", message: "empty body is not allowed", status: false });
  }
  // let notificationDate = moment(req.body.notifiedDate)
  console.log('ndd', req.body.notifiedDate)
  try {
    const goal = await Goal.create({
      name: req.body.name,
      patientId: req.body.patientId,
      notifiedDate: req.body.notifiedDate,
      isArchived: false,
      createdById: req.user_id,
      goalType: req.body.goalType,
      suggestionTips: req.body.suggestionTips,
      isCompleted: false,
      activityTake: req.body.activityTake,
      emotionsExperience: req.body.emotionsExperience,
      feel: req.body.feel,
    });

    const notification = await Notification.create({
      receiverId: req.body.patientId,
      notificationDate: req.body.notifiedDate,
      goalId: goal._id
    })

    const { _id: goalId } = goal;
    console.log(`Here is the newly created goal ID ${goalId}`);
    console.log(`Here are the request questions array ${req.body.questions}`);

    await seedQuestions(goalId, req.body.goalType, req.body.questions);

    res.status(201).json({
      data: goal,
      message: "Goal created successfully",
      status: true,
    });
  } catch (error) {
    console.log('err', error)
    return res.status(500).json({
      data: error,
      message: "Internal server error",
      status: false,
    });
  }
};

const getGoalsByPatientId = async (req, res) => {
  Goal.find({ patientId: req.params.id }).sort({createdAt: -1}).exec(function(err, goals) {
    if (err) {
      console.log('error', err)
      return res.status(500).json({ data: "", message: "internal server error", status: false });
    }
    return res
      .status(200)
      .json({ data: goals, message: "goals get successfully", status: true });
  });
};

const markGoalAsCompleted = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .json({ data: "", message: "goal Id must be required", status: false });
  }

  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id },
    { isCompleted: true },
    {
      new: true,
    }
  );

  if (!goal) {
    res
      .status(404)
      .json({ data: "", message: "something went wrong", status: false });
  }
  res.status(200).json({
    data: goal,
    message: "goal marked as completed",
    status: true,
  });
};

const sendNotifications = async (req, res) => {
  //UPDATE THIS!
  Goal.find({})
  .then((goals) => {
    console.log(goals)
    // let today = moment()
    for(i=0; i<goals.length; i++) {
      // if(goals[i].notificationDate = )
      // sgMail({message})
    }
  })

}

module.exports = {
  addGoal,
  sendNotifications,
  getGoalsByPatientId,
  markGoalAsCompleted,
};
