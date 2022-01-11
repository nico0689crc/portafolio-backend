require("dotenv").config();

const config = {
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  sendgrid_email_to: process.env.SENDGRID_EMAIL_TO,
  sendgrid_email_from: process.env.SENDGRID_EMAIL_FROM,
  server_port: process.env.SERVER_PORT,
};

module.exports = config;
