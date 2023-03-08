const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const goalQuestions = new Schema({
    question:{
        type: String,
        required: [true,'question is required']
    },
    answer:{
        type: String,
        default: null
    },
    goalId:{
        type: Schema.Types.ObjectId,
        ref: 'Goal'
    }
},
{timestamps: true});


module.exports = mongoose.model('GoalQuestion',goalQuestions)