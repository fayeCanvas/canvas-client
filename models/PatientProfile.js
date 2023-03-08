const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PatentProfileSchema = new Schema({
  birthday: {
    type: String,
  },
  gender: {
    type: String,
  },
  diagnosis: {
    type: String
  },
  goals: {
    type: String
  },
  strengths: {
    type: String
  },
  challenges: {
    type: String
  },
  location: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    default: null
  },
  goal1: {
    type: String
  },
  treatment1: {
    type: String,
  },
  goal2: {
    type:String
  },
  treatment2: {
    type: String
  },
  beginningDiagnosis: {
      type: String
  },

}, {timestamps: true});

module.exports = mongoose.model('PatentProfile', PatentProfileSchema);
