var _config = {
	host:'www.swyc.com',
	port:'80',
	redisConfig:{
		name: 'JSESSIONID',
	    secret: 'node-1',
	    cookie: {
	        maxAge: 1000 * 60 * 60 * 24,
	        httpOnly:true
	    },
	    sessionStore: {
	        host: '127.0.0.1',
	        port: '6379',
	        db: 1,
	        ttl: 60 * 60 * 24,
	        logErrors: true
	    }
	},
	mongoConfig:{
		mongodb: 'mongodb://admin:123123@127.0.0.1/swyc',
		// mongodb: 'mongodb://10.28.5.197/swyc',
	    database: 'swyc',
	    server: '127.0.0.1'
	},
	authSecret:'080994c0cce4b706'
}
module.exports= _config;