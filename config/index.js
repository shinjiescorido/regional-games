require('node-env-file')(`${__dirname}/../.env`);
module.exports = {
	appName : process.env.APP_NAME || 'china',
	apiBetsUrl : process.env.API_HISTORY_URL || '127.0.0.1',
	serverHost : process.env.SERVER_HOST || '127.0.0.1',
	serverPort : process.env.SERVER_PORT || 9090,
	redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || ''
    },
	db : {
		host : process.env.DB_HOST || '172.21.0.2',
		user : process.env.DB_USER || 'root',
		port : process.env.DB_PORT || 3307,
		pass : process.env.DB_PASS || 'password',
		gameDb : {
			bc : process.env.DB_NAME || 'baccarat',
			dt : process.env.DB_NAME || 'dragontiger',
			poker : process.env.DB_NAME || 'poker',
			sicbo : process.env.DB_NAME || 'sicbo',
			paigow : process.env.DB_NAME || 'paigow',
			api : process.env.DB_NAME || 'nihtan_api'
		}
	}
};
