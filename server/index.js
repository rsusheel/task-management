/**
 * Info: Entrypoint for the application.
 * Author: Sushil Thakur
 * Date: 6 August 2023
 */

// Load environment variables from the .env file
require('dotenv').config();

// Imports
const express = require("express");
const app = express();
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
var passport = require('passport');
const pool = require('./config/database');
const flash = require('connect-flash');
const catchIE = require('./lib/catchInternalError').catchIE;
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: process.env.FE_APP_URL, // Allow requests from this origin
    credentials: true, // Allow credentials (cookies)
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Middleware to parse JSOn requests
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Application session config
app.use(
    session({
        store: new pgSession({
            pool,
            tableName: 'sessions'
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2,
            secure: false
        },
        timezone: process.env.DB_TIMEZONE
    })
);

// Import passport config
require('./config/passport');

// Use passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash
app.use(flash());

// Import the route files
const mainRoute = require('./routes/main');
const workspaceRoute = require('./routes/workspace');
const taskRoute = require('./routes/task');
const lookupRoute = require('./routes/lookup');
const auditRoute = require('./routes/audit');
const userPreferenceRoute = require('./routes/userPreference');
const groupRoute = require('./routes/group');
const subtaskRoute = require('./routes/subtask');
const inviteRoute = require('./routes/invite');

// Use the route files
app.use('/', mainRoute);
app.use('/workspace', workspaceRoute);
app.use('/task', taskRoute);
app.use('/lookup', lookupRoute);
app.use('/audit', auditRoute);
app.use('/userPreference', userPreferenceRoute);
app.use('/group', groupRoute);
app.use('/subtask', subtaskRoute);
app.use('/invite', inviteRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    catchIE(res, err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Application started on the port ${PORT}`)
});