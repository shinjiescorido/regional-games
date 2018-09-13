'use strict';

	/*
	|--------------------------------------------------------------------------
	| Bets Model v1.0
	|--------------------------------------------------------------------------
	| Author : Shinji Escorido
	|
	*/

module.exports = (sequelize, DataTypes) => {
	const Bets = sequelize.define("bet", {
		id 				: { type : DataTypes.INTEGER(10).UNSIGNED, primaryKey : true, autoIncrement : true, allowNull : false },
		round_id      	: { type : DataTypes.INTEGER(10).UNSIGNED, allowNull : false},
		type 			: { type : DataTypes.ENUM, values : ["r", "s", "b"], defaultValue: "r" },
		user_id 		: { type : DataTypes.INTEGER(10).UNSIGNED,allowNull:false },
		bet_history   	: { type : DataTypes.JSON, defaultValue:null },
		total_bet     	: { type : DataTypes.DECIMAL(15, 2), defaultValue:null },
		total_winning 	: { type : DataTypes.DECIMAL(15, 2), defaultValue:null },
		total_win     	: { type : DataTypes.DECIMAL(15, 2), defaultValue:null },
		total_lost    	: { type : DataTypes.DECIMAL(15, 2), defaultValue:null },
		total_rolling 	: { type : DataTypes.DECIMAL(15, 2), defaultValue:null },
		bet_range     	: { type : DataTypes.STRING(20), defaultValue:null },
		device 			: { type : DataTypes.ENUM, values : ["m", "w"], defaultValue : "w" },
		bet_id  		: { type : DataTypes.STRING(32), defaultValue:null },
		session_id 		: { type : DataTypes.STRING(40), defaultValue:null }
	});
	return Bets;
};