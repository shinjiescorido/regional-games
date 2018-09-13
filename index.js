const express  = require('express');
const app      = express();
let cluster    = require('cluster');
const cfg      = require('./config');
const _        = require('lodash');
const numCPUs  = require('os').cpus().length;
const cons     = require('./lib/constants');
const redis    = require("redis");
let subscriber = redis.createClient(cfg.redis);
let publisher = redis.createClient(cfg.redis);
let socketSub = redis.createClient(cfg.redis);

let workers    = [];
let colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});
console.log('silly'.error);
if (cluster.isMaster) {
	app.get('/', function (req, res) {
		res.send('running');
	});

	let server = app.listen(cfg.serverPort, () => {
	   let host = server.address().address;
	   let port = server.address().port;
	   
	   console.log("Example app listening at http://%s:%s".verbose, host, port);
	   publisher.publish('regional-init','{ "isInit":true }');
	});

	for (let i = 0; i < numCPUs; i++) {
		let agency = {};
		if(cons.jobs[i]){
			agency[cons.jobs[i]] = cluster.fork(); 
			workers.push(agency);
		}
	}
	socketSub.on("message", (c,mess)=>{
		let proc = require('./lib/process');
		proc.deleteRoom(JSON.parse(mess));
	});
	socketSub.subscribe('socket-servers');
	subscriber.on("message", (channel, m) => {
		if(!m)
			return;
		let msg = JSON.parse(m);

		if(!cons.eventCheck[msg.eventName])
			return;
		//console.log('message=>',msg);
		_.find(workers,msg.eventName)[msg.eventName].send(msg);
	});
	subscriber.subscribe('game-servers');

	cluster.on('exit', (worker, code, signal)=>{
		 console.log('worker '.error + worker.process.pid + ' exited'.error);
	});
} else {
	process.on('message',(message)=>{
		//if(message.gameName !== 'Sicbo')
		//	return;
		let processors = require('./lib/process');
		processors[message.eventName](message);
	});
}
