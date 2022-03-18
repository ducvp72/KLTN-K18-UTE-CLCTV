const client = require('twilio');
const { sms } = require('../config/config');

client(sms.smtp.auth.user, sms.smtp.auth.pass)
  .messages.create({
    body: 'This is your verification code: 123456 ',
    from: '+15017122661',
    to: '+15558675310',
  })
  // eslint-disable-next-line no-console
  .then((message) => console.log(message.sid));
