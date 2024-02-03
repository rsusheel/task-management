/**
 * Info: Gets the data for application initialization.
 * Author: Sushil Thakur
 * Date: 6 August 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const isAuth = require('../lib/authMiddleware').isAuth;
const defaultPage = require('../lib/authMiddleware').defaultPage;
const verificationMail = require('../lib/verificationMail');
const logoutPage = require("../lib/authMiddleware").logoutPage;

router.get('/', (req, res, next) => {
    try {
        res.status(200).json({message: 'status 200 OK'});
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        const saltHash = genPassword(req.body.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;
        const creationDatetime = (new Date()).toISOString();
        const beginningDatetime = new Date(0);
        let targetDatetime = new Date();
        targetDatetime.setDate(targetDatetime.getDate() + 15);

        const insertUserQuery = 'INSERT INTO user_details(username, email_id, first_name, last_name, password_hash, salt, creation_datetime) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id';
        const {rows: [user]} = await client.query(insertUserQuery, [req.body.username, req.body.email, 'aaa', 'zzz', hash, salt, creationDatetime]);

        const insertWorkspaceQuery = 'INSERT INTO workspace_details (creator_id, workspace_name, workspace_tagline, workspace_description, workspace_creation_datetime, admin_users, team_members) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING workspace_id';
        const {rows: [workspace]} = await client.query(insertWorkspaceQuery, [user.user_id, 'Default', 'Default workspace', 'Default workspace upon user creation', creationDatetime, [user.user_id], [user.user_id]]);

        const insertGroupQuery = 'INSERT INTO group_details (user_id, workspace_id, group_name, group_description, group_creation_datetime) VALUES ($1, $2, $3, $4, $5) RETURNING group_id';
        const {rows: [group]} = await client.query(insertGroupQuery, [user.user_id, workspace.workspace_id, 'Default', 'Default group', creationDatetime]);

        verificationMail.sendMail(user.user_id, req.body.email)

        await Promise.all([
            client.query('UPDATE user_preference_details SET default_workspace_id=$1 WHERE user_id=$2',
                [workspace.workspace_id, user.user_id]),

            client.query('INSERT INTO user_preference_details (user_id, default_workspace_id) VALUES ($1, $2)',
                [user.user_id, workspace.workspace_id]),

            client.query('INSERT INTO filter_options (user_id, workspace_id, group_ids, task_states, importance, has_sub_task, creation_datetime, creation_dt_operator, target_datetime, target_dt_operator, sorting_field, sorting_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                [user.user_id, workspace.workspace_id, [group.group_id], ['Created', 'In Progress', 'On Hold', 'Re-opened'], ['Low', 'Medium', 'High'], [true, false], beginningDatetime, '>=', targetDatetime, '<=', 'task_state', 'desc'])
        ]);

        await client.query('COMMIT');

        res.status(200).json({message: 'User registered successfully. Email verification required.'});
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});

router.post('/verifyEmail', async (req, res, next) => {
    try {
        const verificationCode = req.body.verification_code;
        const user_id = req.body.user_id;

        const {rows} = await pool.query('SELECT verification_code, code_send_datetime FROM email_verification_details where user_id=$1', [user_id])

        const currentTime = new Date();
        const previousTime = rows[0].code_send_datetime;
        const timeDifference = (currentTime - previousTime)/60000;

        const originalVerificationCode = rows[0].verification_code;

        if(timeDifference < 10 && verificationCode == originalVerificationCode) {
            await pool.query('UPDATE email_verification_details SET email_verified=$1 WHERE user_id=$2', [true, user_id]);
            res.status(200).json({message: 'Account verified. Login now!'})
        } else if (timeDifference < 10 && verificationCode != originalVerificationCode) {
            res.status(401).json({message: 'Wrong code. Check again.'})
        } else {
            res.status(401).json({message: 'Code expired. Resend again.'})
        }
    } catch (err) {
        next(err);
    }
})

router.post('/resendCode', async (req, res, next) => {
    try{
        await verificationMail.resendMail(req.body.user_id, req.body.email_id)
        res.status(200).json({message: 'Verification code resent successfully.'})
    } catch (err) {
        next(err);
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/login-success',
    failureRedirect: '/login-failure',
    failureFlash: true
}))

router.get('/login-failure', defaultPage, (req, res, next) => {
    try {
        const flashMessage = req.flash('error');
        req.logout((err) => {
            if(err){
                return next(err)
            }
        })
        if(flashMessage.length != 0){
            res.status(401).json({message: flashMessage[0]});
        } else {
            res.status(401).json({message: 'Please login from the login page.'});
        }
    } catch (err) {
        next(err);
    }
});

router.get('/login-success', defaultPage, (req, res, next) => {
    try {
        res.status(200).json({message: 'Please login from the login page.'});
    } catch (err) {
        next(err);
    }
});

router.get('/logout', logoutPage, (req, res, next) => {
    try {
        req.logout((err) => {
            if(err){
                return next(err)
            }
        })
        res.status(200).json({message: 'Logged out successfully.'})
    } catch (err) {
        next(err);
    }
})

router.get('/user', isAuth, async (req, res, next) => {
    try {
        const {rows} = await pool.query('SELECT user_id, username, email_id, first_name, last_name FROM user_details where user_id=$1', [req.user.user_id])
        res.status(200).json(rows)
    } catch (err) {
        next(err);
    }
});

router.post('/deleteUser', isAuth, async (req, res, next) => {
    try {
        


        res.status(200).json({message: 'The account has been deleted.'})
    } catch (err) {
        next(err);
    }
})


// temp for testing
router.get('/login', defaultPage, (req, res, next) => {
    try {
        const form = '<h1>Login Page</h1><form method="POST" action="login">\
        Enter Username:<br><input type="text" name="username">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';

        res.send(form);
    } catch (err) {
        next(err);
    }
});

router.get('/register', defaultPage, (req, res, next) => {
    try {
        const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br>Email: <br><input type="text" name="email">\
                    <br><br><input type="submit" value="Submit"></form>';

        res.send(form);
    } catch (err) {
        next(err);
    }
});

// Check the authentication status
router.get('/authenticationStatus',
    (req, res, next) => {
        if(req.isAuthenticated()) {
            next();
        } else {
            res.status(200).json({status: false})
        }
    },
    (req, res, next) => {
    try {
        res.status(200).json({status: true})
    } catch (err) {
        next(err);
    }
})

module.exports = router;