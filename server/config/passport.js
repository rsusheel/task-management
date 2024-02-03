/**
 * Info: Contains passport local strategy to verify user identity.
 * Author: Sushil Thakur
 * Date: 6 August 2023
 */

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require('./database')
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
}

const verifyCallback = async (username, password, done) => {
    try {
        const query = 'SELECT * FROM user_details WHERE username = $1';
        const values = [username];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return done(null, false, {message: 'User not found.'});
        }

        const user = result.rows[0];
        const isValid = validPassword(password, user.password_hash, user.salt)
        if (!isValid) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.user_id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const query = 'SELECT * FROM user_details WHERE user_id = $1';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return done(null, false)
        }

        return done(null, result.rows[0]);
    } catch (err) {
        return done(err)
    }
})

module.exports = passport