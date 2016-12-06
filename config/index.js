var _config = {
	host:'10.28.5.197',
	port:'3000',
	redisConfig:{
		name: 'JSESSIONID',
	    secret: 'node-1',
	    cookie: {
	        maxAge: 1000 * 60 * 60 * 24
	    },
	    sessionStore: {
	        host: '10.28.5.197',
	        port: '6379',
	        db: 1,
	        ttl: 60 * 60 * 24,
	        logErrors: true
	    }
	},
	mongoConfig:{
		mongodb: 'mongodb://10.28.5.197/swyc',
	    database: 'swyc',
	    server: '10.28.5.197'
	}
}
module.exports= _config;