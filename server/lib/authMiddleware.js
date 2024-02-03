/**
 * Info: Contains the function to authorize the user.
 * Author: Sushil Thakur
 * Date: 6 August 2023
 */

const pool = require("../config/database");

module.exports.isAuth = async (req, res, next) => {
    if (req.isAuthenticated()) {

        const {rows} = await pool.query('SELECT email_verified FROM email_verification_details WHERE user_id=$1', [req.user.user_id])
        if (rows[0].email_verified) {
            req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 2);
            req.session.save();
            next();
            
        } else {
            res.status(401).json({message: 'Please verify your email and login again.'});
        }
    } else {
        res.status(401).json({ message: 'You are not authorized to view this resource' });
    }
}

module.exports.defaultPage = (req, res, next) => {
    if(req.isAuthenticated()) {
        res.status(200).json({message: 'You are logged in.'})
    } else {
        next();
    }
}

module.exports.logoutPage = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(401).json({message: 'You are are not logged in.'})
    }
}