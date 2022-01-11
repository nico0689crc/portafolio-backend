const express = require("express");
const { body, validationResult } = require("express-validator");
const sendgridEmail = require("@sendgrid/mail");
const globalConfig = require("./utils/config");
const unknownEndpoint = require("./middlewares/unknownEndpoint");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

const app = express();

app.use(express.json());
sendgridEmail.setApiKey(globalConfig.sendgrid_api_key);

app.post(
  "/",
  [
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage(() => {
        return "Email format is required.";
      }),
    body("name")
      .isLength({ min: 8 })
      .withMessage(() => {
        return "Name is required.";
      }),
    body("message")
      .isLength({ min: 20 })
      .trim()
      .escape()
      .withMessage(() => {
        return "Message is required and more than 20 characters.";
      }),
  ],
  async (req, res, next) => {
    try {
      const errors = await validationResult(req);
      const { email, name, message } = req.body;

      if (!errors.isEmpty()) {
        const errorMessages = errors.errors.map(error => {
          return {
            source: {
              location: error.location,
              pointer: error.param,
            },
            detail: error.msg,
          };
        });

        return next(new Error(JSON.stringify(errorMessages)));
      }

      const sendGridMessage = {
        to: globalConfig.sendgrid_email_to,
        from: globalConfig.sendgrid_email_from,
        subject: `Portafolio's Message from ${name}`,
        text: "Text",
        html: `<p>${message}</p>`,
      };

      await sendgridEmail.send(sendGridMessage);

      res.status(200).send({ email, name, message });
    } catch (error) {
      return next(new Error(error.message));
    }
  }
);

app.use(unknownEndpoint);
app.use(globalErrorHandler);

app.listen(globalConfig.server_port, async () => {
  console.log("Server running on port: " + globalConfig.server_port);
});
