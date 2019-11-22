const appRoot = require('app-root-path');
require("dotenv").config({ path: appRoot.path + '/.env'  });

module.exports = {
    APP_ID: process.env.APP_ID,
    ACCESS_KEY: process.env.S3_ACCESS_KEY,
    SECRET_KEY: process.env.S3_SECRET_KEY,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
}