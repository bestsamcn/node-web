var _config = {
	host:'127.0.0.1',
	port:'3000',
	redisConfig:{
		name: 'JSESSIONID',
	    secret: 'node-1',
	    cookie: {
	        maxAge: 1000 * 60 * 60 * 24
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
		mongodb: 'mongodb://127.0.0.1/swyc',
	    database: 'swyc',
	    server: '127.0.0.1'
	},
	authSecret:'080994c0cce4b706'
}
module.exports= _config;