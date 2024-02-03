/**
 * Info: Contains the user verification logic.
 * Author: Sushil Thakur
 * Date: 12 August 2023
 */

const transporter = require('../config/mailer');
const pool = require('../config/database');

const generateVerificationCode = () => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

const sendMail = async (user_id, email_id) => {
    const verificationCode = generateVerificationCode();
    const currentDatetime = (new Date()).toISOString();
    
    await pool.query("INSERT INTO email_verification_details (user_id, email_id, verification_code, code_send_datetime, email_verified) VALUES ($1, $2, $3, $4, $5)", [user_id, email_id, verificationCode, currentDatetime, false]);

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email_id,
        subject: 'Todo App - User verification code',
        text: `Please fill in the below verification code at this url. ${verificationCode}`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error: ', err);
        } else {
            console.log('Email sent: ', info.response);
        }
    })
}

const resendMail = async (user_id, email_id) => {
    const verificationCode = generateVerificationCode();

    const result = await pool.query("UPDATE email_verification_details SET verification_code=$1, code_send_datetime=timezone('GMT', now()) WHERE user_id=$2", [verificationCode, user_id]);

    const mailOptions = {
        from: process.env.MAIL_USER,
        to:email_id,
        subject: 'Todo App - User verification code | Resent',
        text: `Please fill in the below verification code at this url. ${verificationCode}`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error: ', err);
        } else {
            console.log('Email sent: ', info.response);
        }
    })
}

module.exports = {
    sendMail,
    resendMail
};