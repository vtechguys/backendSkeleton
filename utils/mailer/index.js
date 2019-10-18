'use strict'
const nodeMailer = require('nodemailer');

const { constants } = require('../../config');
const logger = require('../logger');

const { emailTemplate } = require('../../template');

const mailTypes = {
    ACCOUNT_ACTIVATION_LINK: "accountActivationLink",
    ATTEMPT_RESET_PASSWORD: "resetPassword",
    SUCCESS_RESET_PASSWORD: "resetPasswordSuccess"

};
function accountAcivationLinkEmailGenerate(userData, type) {
    const emailObj = {};
    const payload = constants.REQ_URL + "/activation-email?token=" + userData.token + "&email" + userData.email;
    emailObj.text = "Your Account Activation link is " + payload;
    emailObj.templateData = { ...userData, type: type, payload };
    return emailObj;
}
function attemptResetPasswordEmailGenerate(userData, type) {
    const emailObj = {};
    const payload = constants.REQ_URL = emailObj.payload = payload + "/account/reset-password?token=" + userData.token + "&email" + userData.email;
    emailObj.text = "Your Password reset link is " + payload;
    emailObj.templateData = { ...userData, type: type };
    return emailObj;
}
function successResetPasswordEmailGenerate(userData, type) {
    const emailObj = {};
    emailObj.text = "Your Password was reset";
    emailObj.templateData = { ...userData, type: type };
    return emailObj;
}





function _sendMail(To, Subject, EmailText, HtmlBody) {
    logger.debug("utils mailer sendMail");
    let SMTP_URL = "smtps://" + constants.MAIL_TRANSPORT_AUTH_EMAIL + ":" + constants.MAIL_TRANSPORT_AUTH_PASSWORD + "@" + constants.MAIL_URL;
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
    })
}

const mailer = {
    createMail(userData, type) {
        logger.debug("utils mailer createMail");
        let htmlBody = "";
        let templateData;
        switch (type) {
            case mailTypes.ACCOUNT_ACTIVATION_LINK:
                const emailObj = accountAcivationLinkEmailGenerate(userData, type);
                htmlBody = emailTemplate.accountAcivation(emailObj.templateData);
                _sendMail(emailObj.to, emailObj.subject, emailObj.text, htmlBody);
                break;

            case mailTypes.ATTEMPT_RESET_PASSWORD:
                const emailObj = attemptResetPasswordEmailGenerate(userData, type);
                htmlBody = emailTemplate.attemptResetPassword(emailObj.templateData);
                _sendMail(emailObj.to, emailObj.subject, emailObj.text, htmlBody);
                break;

            case mailTypes.SUCCESS_RESET_PASSWORD:
                const emailObj = successResetPasswordEmailGenerate(userData, type);
                htmlBody = emailTemplate.resetPasswordSuccess(templateData);
                _sendMail(emailObj.to, emailObj.subject, emailObj.text, htmlBody);
                break;

        }

    }
};



module.exports = mailer;