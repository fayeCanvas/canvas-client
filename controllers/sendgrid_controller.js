const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY2);
// sgMail.setApiKey('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')
module.exports = {
  async sendEmail(req, res) {
    var html = req.body.html || ''
    var text = req.body.text || null
    var to = req.body.to
    var subject = req.body.subject
    var from = req.body.from
    console.log(req.body)
    let msg = {
      to,
      from: from,
      subject: `${subject}`,
      html: html,
      text: text
    }
    console.log('sg',process.env.SENDGRID_API_KEY2)
    console.log('msg', msg)
    try {
      await sgMail
      .send(msg)
      .then((msg, err) => {
         if (err) {
           console.log('err', err)
           console.log('error.response.body', error.response.body)
           return res.status(400).json({error: err.response.body})
         }
       });
       return res.status(200).send({message: 'email sent'})

    } catch (err) {
      console.log('There was an error sending this message.', err)
      return res.status(err.code).json({error: err.message})
    }
  }
}
