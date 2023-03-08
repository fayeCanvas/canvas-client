const GoalQuestion = require("../models/goalQuestion");

const getQuestionsByGoalId = async (req, res) => {
  console.log("Here is the requested ID", req.params.id);
  GoalQuestion.find({ goalId: req.params.id }).populate({path: 'goalId', model: 'Goal'}).sort({createdAt: 1})
  .exec(function (err, goals) {
    if (err) {
      console.log('err', err)
      res
        .status(500)
        .json({ data: "", message: "internal server error", status: false });
    }
    console.log('goals', goals)
    res.status(200).json({
      data: goals,
      message: "goal questions get successfully",
      status: true,
    });
  });
};

const addAnswer = async (req, res, next) => {
  if (!req.params.id) {
    res
      .status(400)
      .json({ data: "", message: "question Id must required", status: false });
  }

  const question = await GoalQuestion.findOneAndUpdate(
    { _id: req.params.id },
    { answer: req.body.answer },
    {
      new: true,
    }
  );

  if (!question) {
    res
      .status(404)
      .json({ data: "", message: "something went wrong", status: false });
  }
  res.status(200).json({
    data: question,
    message: "answer added successfully",
    status: true,
  });
};

module.exports = {
  getQuestionsByGoalId,
  addAnswer,
};
