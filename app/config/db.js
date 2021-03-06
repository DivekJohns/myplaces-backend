/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const logger = require('../common/logger');

const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	autoReconnect: true,
	useUnifiedTopology: true,
	reconnectTries: 1000000,
	reconnectInterval: 3000,
	keepAlive: true, 
	keepAliveInitialDelay: 300000
};


mongoose.connect(process.env.DBURL,options).catch((e)=>{
	logger.error('db: mongodb error ' + e);
	process.exit(1);
});

mongoose.connection.on('error', function(e){
	logger.error('db: mongodb error ' + e);
	mongoose.connect(process.env.DBURL,options).catch(()=>{
		process.exit(1);
	});	
});

mongoose.connection.on('connected', function(){
	logger.info('Connected to database !: ' + process.env.DBURL);
});

mongoose.connection.on('disconnecting', function(){
	logger.info('database is disconnecting!!!');
});

mongoose.connection.on('disconnected', function(){

	logger.warn('database is disconnected!!!');
	mongoose.connect(process.env.DBURL,options).catch(()=>{
		process.exit(1);
	});
});

mongoose.connection.on('reconnected', function(){
	logger.info('db: mongodb is reconnected: ' + process.env.DBURL);
});

mongoose.connection.on('timeout', function(e) {
	logger.warn('db: mongodb timeout '+e);
});

mongoose.connection.on('close', function(){
	logger.warn('db: mongodb connection closed');
});

module.exports = mongoose;