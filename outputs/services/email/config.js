const appRoot = require('app-root-path')
require("dotenv").config({ path: appRoot.path + '/.env'  })

module.exports = {
	SENDGRID_API: process.env.SENDGRID_API,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_HOST: process.env.REDIS_HOST,
	APP_ID: process.env.APP_ID,
	email: {
		from: `${process.env.APP_NAME}@microgen.com`,
		logo: null
	},
	application: {
		name: process.env.APP_NAME.slice(0, 1).toUpperCase() + process.env.APP_NAME.slice(1)
	}
};
