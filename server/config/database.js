/**
 * Info: Contains the server application connection with the Postgres DB.
 * Author: Sushil Thakur
 * Date: 6 August 2023
 */

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    timezone: process.env.DB_TIMEZONE
})

module.exports = pool;