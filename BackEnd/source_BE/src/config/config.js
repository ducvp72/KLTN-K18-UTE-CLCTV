const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_URL_TEST: Joi.string().required().description('Mongo DB TEST url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    VERIFY_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which send verify code'),
    VERIFY_EXPIRATION_MINUTES_GROUP: Joi.number().default(10).description('minutes after which create verify code'),

    SMS_USERNAME: Joi.string().description('username for sms service from twilio'),
    SMS_PASSWORD: Joi.string().description('password for sms service from twilio'),
    CLOUDINARY_NAME: Joi.string().description('cloudinary name'),
    CLOUDINARY_URL: Joi.string().description('cloudinary url'),
    CLOUDINARY_API_KEY: Joi.string().description('cloudinary api key'),
    CLOUDINARY_API_SECRET: Joi.string().description('cloudinary api secret'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    urlTest: envVars.MONGODB_URL_TEST,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      // service: 'gmail',
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  code: {
    verifyExpirationMinutes: envVars.VERIFY_EXPIRATION_MINUTES,
    verifyExpirationMinutesGroup: envVars.VERIFY_EXPIRATION_MINUTES_GROUP,
  },
  sms: {
    smtp: {
      auth: {
        user: envVars.SMS_USERNAME,
        pass: envVars.SMS_PASSWORD,
      },
    },
  },
  cloudinary: {
    name: envVars.CLOUDINARY_NAME,
    url: envVars.CLOUDINARY_URL,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
};
