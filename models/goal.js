const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notifiedDate: {
      type: Date,
      default: Date.UTC,
    },
    goalType: {
      type: String,
      enum: ["Observational", "Directive", "ObservationalAndDirective"],
      default: "Observational",
    },
    activityTake: {
      type: String,
    },
    emotionsExperience: {
      type: String,
    },
    feel: {
      type: String,
    },
    suggestionTips: {
      type: String,
      default: null,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
