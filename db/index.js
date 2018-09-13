'use strict';

	/*
	|--------------------------------------------------------------------------
	| database init v1.0
	|--------------------------------------------------------------------------
	| Author : Shinji Escorido
	| defining our database and connecting different models
	|
	*/

const Sequelize = require('bf-ormify');
const conf               = require( '../config/' );
let dbOptions = {  
  host    : conf.db.host,
  port    : conf.db.port,
  dialect : 'mysql',
  logging : true,
  define  : {
    underscored: true
  },
  pool: {
    max: 20,
    idle: 30000
  }
};
/*let createSchema = [
	Sequelize.query("create schema if not exists baccarat"),
	Sequelize.query("create schema if not exists dragontiger"),
	Sequelize.query("create schema if not exists sicbo"),
	Sequelize.query("create schema if not exists poker"),
	Sequelize.query("create schema if not exists nihatan_api")
];

Promise.all(createSchema)
.then(schemas => {*/
	let bcSequelize = new Sequelize(conf.db.gameDb.bc, conf.db.user, conf.db.pass, dbOptions);

	let dtSequelize = new Sequelize(conf.db.gameDb.dt, conf.db.user, conf.db.pass, dbOptions);

	let pokerSequelize = new Sequelize(conf.db.gameDb.poker, conf.db.user, conf.db.pass, dbOptions);

	let sicboSequelize = new Sequelize(conf.db.gameDb.sicbo, conf.db.user, conf.db.pass, dbOptions);

	let paigowSequelize = new Sequelize(conf.db.gameDb.paigow, conf.db.user, conf.db.pass, dbOptions);

	let nihtanAPISequelize = new Sequelize(conf.db.gameDb.api, conf.db.user, conf.db.pass, dbOptions);
	
	bcSequelize.dialect.supports.schemas        = true;
	dtSequelize.dialect.supports.schemas        = true;
	pokerSequelize.dialect.supports.schemas     = true;
	sicboSequelize.dialect.supports.schemas     = true;
	paigowSequelize.dialect.supports.schemas    = true;
	nihtanAPISequelize.dialect.supports.schemas = true;
	
	const db = {
		Sequelize : Sequelize,
		nihtanApi : {
			sequelize : nihtanAPISequelize,
			dealers   : require('./models/dealers')(nihtanAPISequelize, Sequelize),
			users     : require('./models/users')(nihtanAPISequelize,Sequelize),
			vendors   : require('./models/vendors')(nihtanAPISequelize,Sequelize)
		},
		bc : {
			sequelize : bcSequelize,
			tables    : require('./models/game_tables')(bcSequelize, Sequelize),
			bets      : require('./models/bets')(bcSequelize,Sequelize),
			rounds    : require('./models/rounds')(bcSequelize,Sequelize),
			rooms     : require('./models/rooms')(sicboSequelize,Sequelize)
		},
		dt : {
			sequelize : dtSequelize,
			tables    : require('./models/game_tables')(dtSequelize, Sequelize),
			bets      : require('./models/bets')(dtSequelize,Sequelize),
			rounds    : require('./models/rounds')(dtSequelize,Sequelize),
			rooms     : require('./models/rooms')(sicboSequelize,Sequelize)
		},
		poker : {
			sequelize : pokerSequelize,
			tables    : require('./models/game_tables')(pokerSequelize, Sequelize),
			bets      : require('./models/bets')(pokerSequelize,Sequelize),
			rounds    : require('./models/rounds')(pokerSequelize,Sequelize),
			gameMarks : require('./models/game_marks')(pokerSequelize,Sequelize)
		},
		sicbo : {
			sequelize : sicboSequelize,
			tables    : require('./models/game_tables')(sicboSequelize, Sequelize),
			bets      : require('./models/roomBets')(sicboSequelize,Sequelize),
			rounds    : require('./models/rounds')(sicboSequelize,Sequelize),
			rooms     : require('./models/rooms')(sicboSequelize,Sequelize)
		},
		paigow : {
			sequelize : paigowSequelize,
			tables    : require('./models/game_tables')(paigowSequelize, Sequelize),
			bets      : require('./models/roomBets')(paigowSequelize,Sequelize),
			rounds    : require('./models/rounds')(paigowSequelize,Sequelize),
			rooms     : require('./models/rooms')(paigowSequelize,Sequelize)
		}
	};
	// bc
	db.nihtanApi.dealers.hasMany(db.bc.rounds);
	db.bc.rounds.belongsTo(db.nihtanApi.dealers);

	db.bc.bets.belongsTo(db.nihtanApi.users);
	db.nihtanApi.users.belongsTo(db.nihtanApi.vendors);

	db.bc.rounds.belongsTo(db.bc.tables, { foreignKey : 'table_id' });
	db.bc.rounds.hasMany(db.bc.bets);
	db.sicbo.rooms.belongsTo(db.sicbo.bets, { foreign : 'room_id' });
	db.nihtanApi.users.hasMany(db.bc.bets);
	db.nihtanApi.vendors.hasMany(db.nihtanApi.users);

	// dt
	db.nihtanApi.dealers.hasMany(db.dt.rounds);
	db.dt.rounds.belongsTo(db.nihtanApi.dealers);

	db.dt.bets.belongsTo(db.nihtanApi.users);
	db.nihtanApi.users.belongsTo(db.nihtanApi.vendors);

	db.dt.rounds.belongsTo(db.dt.tables, { foreignKey : 'table_id' });
	db.dt.rounds.hasMany(db.dt.bets);
	db.sicbo.rooms.belongsTo(db.sicbo.bets, { foreign : 'room_id' });
	db.nihtanApi.users.hasMany(db.dt.bets);
	db.nihtanApi.vendors.hasMany(db.nihtanApi.users);

	// poker
	db.nihtanApi.dealers.hasMany(db.poker.rounds);
	db.poker.rounds.belongsTo(db.nihtanApi.dealers);

	db.poker.gameMarks.belongsTo(db.poker.rounds);
	db.poker.gameMarks.belongsTo(db.poker.tables);

	db.poker.bets.belongsTo(db.nihtanApi.users);
	db.nihtanApi.users.belongsTo(db.nihtanApi.vendors);

	db.poker.rounds.belongsTo(db.poker.tables, { foreignKey : 'table_id' });
	db.poker.rounds.hasMany(db.poker.bets);

	db.nihtanApi.users.hasMany(db.poker.bets);
	db.nihtanApi.vendors.hasMany(db.nihtanApi.users);

	// sicbo
	db.nihtanApi.dealers.hasMany(db.sicbo.rounds);
	db.sicbo.rounds.belongsTo(db.nihtanApi.dealers);

	db.sicbo.bets.belongsTo(db.nihtanApi.users);
	db.nihtanApi.users.belongsTo(db.nihtanApi.vendors);

	db.sicbo.rounds.belongsTo(db.sicbo.tables, { foreignKey : 'table_id' });
	db.sicbo.rounds.hasMany(db.sicbo.bets);

	//db.sicbo.bets.belongsTo(db.sicbo.rooms);
	db.sicbo.rooms.belongsTo(db.sicbo.bets, { foreign : 'room_id' });
	//db.sicbo.rooms.hasMany(db.sicbo.bets);
	//db.sicbo.users.hasMany(db.sicbo.rooms);

	db.nihtanApi.users.hasMany(db.sicbo.bets);
	db.nihtanApi.vendors.hasMany(db.nihtanApi.users);

	// paigow
	db.nihtanApi.dealers.hasMany(db.paigow.rounds);
	db.paigow.rounds.belongsTo(db.nihtanApi.dealers);

	db.paigow.bets.belongsTo(db.nihtanApi.users);
	db.nihtanApi.users.belongsTo(db.nihtanApi.vendors);

	db.paigow.rounds.belongsTo(db.paigow.tables, { foreignKey : 'table_id' });
	db.paigow.rounds.hasMany(db.paigow.bets);

	db.paigow.rooms.belongsTo(db.paigow.bets, { foreign : 'room_id' });

	db.nihtanApi.users.hasMany(db.paigow.bets);
	db.nihtanApi.vendors.hasMany(db.nihtanApi.users);

	// ========================================================================

	bcSequelize.sync().then(()=>{
		//console.log('bcSequelize RUNNING.');
	}).catch((e)=>{
		//console.log(JSON.stringify(e,null,'\t'));
	});
	dtSequelize.sync().then(()=>{
		//console.log('dtSequelize RUNNING.');
	});
	pokerSequelize.sync().then(()=>{
		//console.log('pokerSequelize RUNNING.');
	});
	sicboSequelize.sync().then(()=>{
		console.log('sicboSequelize RUNNING.');
	});
	paigowSequelize.sync().then(()=>{
		console.log('paigowSequelize RUNNING.');
	});
	nihtanAPISequelize.sync().then(()=>{
		//console.log('nihtanAPISequelize RUNNING.');
	});

	module.exports = db;
//});
