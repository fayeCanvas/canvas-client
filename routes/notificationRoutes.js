var express = require("express");
// var notificationController = require("../controllers/notification_controller.js");
// var authController = require("../controllers/auth_controller.js");

// const notificationRoutes = new express.Router();
// const { withAuth } = require("../middlewares/authMiddleware");

var cron = require('node-cron');

cron.schedule('*/10 * * * *', () => {
  console.log('running every 10 minute 1, 2, 4 and 5');
  prevDate = Date.today() - 2
  endDate = Date.today() + 2
  let notifications = Notification.find(
      {notifiedDate:{
        $gte: prevDate,
        $lt: endDate
      }
    })
    console.log('notifications', notifications)
    for (i=0; i<notifications.length; i++) {
      let n = notifications[i]
      let user = User.get({_id: n.receiverId})
      console.log('user', user)
      if (checkTime(n.notifiedTime, user)) {
        msg = {
          to: receiverId,
          from: {email: `platform@canvasPad.org`},
          subject: 'Notification from CanvasPad',
          text: `Don't forget to complete your goal for this week! If you've already completed it, disregard this message. If not, sign into canvaspad.org today.`
        }
        try {
          sgMail
          .send(msg)
          .then((msg) => {
            console.log('message sent', msg)
            // return res.status(200).send({ message: `Please check your email for the link to reset your password. The link: ${CLIENT_ROOT}/resetpassword/${resetToken}` });
          })
          .catch(error => {
            const {message, code, response} = error;
            const {headers, body} = response;
            console.error(body)
            // return res.state(422).send({error: body, message: 'Something went wrong while trying to reset your password. Please contact support.'})
          })
        } catch(err) {
          console.log('err sending notification ', err)
        }

      }
    }

});

async function checkTime({user, notificationTime}) {
  let options = {
    timeZone: user.time_zone,
    hour: 'numeric'
  }
  options.time_zone = 'America/Los_Angeles'
  const timeFormat = 'HH:mm:ss';

  formatter = await new Intl.DateTimeFormat([], options);
  currentTime = await formatter.format(new Date())

  let startTimeCheck = notificationTime.subtract(30, 'minutes')
  let endTimeCheck = notificationTime.add(30, 'minutes')
  console.log('startime', startTimeCheck)
  console.log('endTime', endTimeCheck)
  if(currentTime.isBetween(startTimeCheck, timeFormat), (endTimeCheck, timeformat)) {
    console.log('yes time is between.')
    return true
  } else {
    console.log('no timeis not between')
    return false
  }

}

// notificationRoutes.post('/notification/cron')

// module.exports = notificationRoutes;
