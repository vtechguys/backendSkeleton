'use strict'
const nodeMailer = require('nodemailer');

const { constants } = require('../../config');

const logger = require('../logger');

const { email } = require('../../template');

const mailTypes = {
    ACCOUNT_ACTIVATION_LINK: 'accountActivationLink',
    ATTEMPT_RESET_PASSWORD: 'resetPassword',
    SUCCESS_RESET_PASSWORD: 'resetPasswordSuccess'
};

function accountAcivationLinkEmailGenerate(mailData, type) {
    
    const emailObj = {
        ...mailData,
        type
    };
    
    emailObj.TO = mailData.email;

    emailObj.SUBJECT = 'Confirm Your Email';
    
    const payload = constants.REQ_URL + '/activation-email?token=' + mailData.token + '&email=' + mailData.email;
    
    emailObj.REDIRECT_URL = payload;
    emailObj.HEADER = 'Email verification';
    emailObj.SUB_HEADER = 'Email verifaction is required to activate your account.';
    emailObj.TEXT = `This mail is to confirm user registerd with email ${emailObj.TO} on our platform. Please click on link ${emailObj.REDIRECT_URL}`;
    
    const HTML_BODY = email.emailVerification(emailObj);
    
    _sendMail(emailObj.TO, emailObj.SUBJECT, emailObj.TEXT, HTML_BODY);
}
function attemptResetPasswordEmailGenerate(mailData, type) {
    const emailObj = {
        ...mailData,
        type
    };
    
    emailObj.TO = mailData.email;

    emailObj.SUBJECT = 'You Attempting to reset password.';
    
    const payload = constants.REQ_URL + '/reset-password?token=' + mailData.token + '&email=' + mailData.email;
    
    emailObj.REDIRECT_URL = payload;
    emailObj.REDIRECT_URL = payload;
    emailObj.HEADER = 'Attempting to reset password';
    emailObj.SUB_HEADER = 'Attempting to reset passwrord';

    emailObj.TEXT = `This mail is genereated to serve your request of forgot password. Click here ${emailObj.REDIRECT_URL}`;
    
    const HTML_BODY = email.emailVerification(emailObj); //test

    // const HTML_BODY = email.attemptResetPassword(emailObj);
    _sendMail(emailObj.TO, emailObj.SUBJECT, emailObj.TEXT, HTML_BODY);

}
function successResetPasswordEmailGenerate(mailData, type) {
    const emailObj = {};
    emailObj.to = mailData.email;
    emailObj.subject = 'Reset password was successfull';

    emailObj.text = 'Your Password was reset';
    emailObj.templateData = { ...mailData, type: type };
    return emailObj;
}





function _sendMail(To, Subject, EmailText, HtmlBody) {
    logger.debug('utils mailer sendMail');
    // let SMTP_URL = 'smtps://' + constants.MAIL_TRANSPORT_AUTH_EMAIL + ':' + constants.MAIL_TRANSPORT_AUTH_PASSWORD + '@' + constants.MAIL_URL;
    const transporterOptions = {
        host: constants.MAIL_URL,
        port: constants.MAIL_PORT,
        secure: true, // use SSL
        auth: {
            user: constants.MAIL_TRANSPORT_AUTH_EMAIL,
            pass: constants.MAIL_TRANSPORT_AUTH_PASSWORD
        }
    };
    const tranpoter = nodeMailer.createTransport(transporterOptions);

    const mailOptions = {
        from: `'${constants.COMPANY_NAME}' <${constants.MAIL_TRANSPORT_AUTH_EMAIL}>`,
        to: To,
        subject: Subject,
        text: EmailText,
        html: HtmlBody,

    };

    tranpoter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.error(error);
            console.log(error);
        }
        else {
            if (!info) {
                logger.debug('Error sending mail');
                console.log('Error sending mail');
            }
            else {
                logger.debug('Message Sent ');
                console.log('Message Sent', info.response);
            }
        }
    })
}

const mailer = {
    createMail(mailData, type) {
        logger.debug('utils mailer createMail');
        switch (type) {
            case mailTypes.ACCOUNT_ACTIVATION_LINK:
                return accountAcivationLinkEmailGenerate(mailData, type);
            case mailTypes.ATTEMPT_RESET_PASSWORD:
                return attemptResetPasswordEmailGenerate(mailData, type);
            case mailTypes.SUCCESS_RESET_PASSWORD:
                return successResetPasswordEmailGenerate(mailData, type);
        }

    },
    mailTypes
};



module.exports = mailer;