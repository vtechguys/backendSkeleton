'use strict'

const { constants } = require('../../config');
const logger = require('../logger');
const mailer = {
    createMail(userData, type) {
        let that = this;
        logger.debug("utils mailer createMail");
        const emailTemplate = require('./views/email');
        let to = "";
        let text = "";
        let subject = "";
        let htmlBody = "";
        let payload = constants.REQ_URL;
        let templateData;
        switch (type) {
            case "accountActivationLink":
                payload = payload + "/activation/email?token=" + userData.token + "&email" + userData.email;
                text = "Your Account Activation link is " + payload;
                templateData = { ...userData, type: type };
                htmlBody = emailTemplate.accountActivationLink(templateData);
                that.$_sendMail(to, subject, text, htmlBody);
                break;

            case "resetPassword":
                payload = payload + "/account/reset-password?token=" + userData.token + "&email" + userData.email;
                text = "Your Password reset link is " + payload;
                templateData = { ...userData, type: type };
                htmlBody = emailTemplate.resetPasswordLink(templateData);
                that.$_sendMail(to, subject, text, htmlBody);
                break;

            case "resetPasswordSuccess":
                text = "Your Password reset link is " + payload;
                templateData = { ...userData, type: type };
                htmlBody = emailTemplate.resetPasswordSuccess(templateData);
                that.$_sendMail(to, subject, text, htmlBody);
                break;

        }

    },
    $_sendMail(To, Subject, EmailText, HtmlBody) {
        logger.debug("utils mailer sendMail");
        const nodeMailer = require('nodemailer');
        let SMTP_URL = "smtps://" + constants.SMTP_EMAIL + ":" + constants.SMTP_PASSWORD + "@" + constants.SMTP_SERVICE_URL;
        const tranpoter = nodeMailer.createTransport(SMTP_URL);

        const mailOptions = {
            from: constants.COMPANY_NAME + '<h=' + constants.SUPER_ADMIN_EMAIL + '>',
            to: To,
            subject: Subject,
            text: EmailText,
            html: HtmlBody

        };

        tranpoter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error(error);
                console.log(error);
            }
            else {
                if (!info) {
                    logger.debug("Error sending mail");
                    console.log("Error sending mail");
                }
                else {
                    logger.debug("Message Sent ");
                    console.log("Message Sent", info.response);
                }
            }
        });


    }
};



module.exports = mailer;