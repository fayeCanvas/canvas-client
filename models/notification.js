const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  receiverId: {
    type: String,
    required: true
  },
  notificationDate: {
    type: String,
    required: true
  }

}, {timestamps: true});

module.exports = mongoose.model('Notification', NotificationSchema);
