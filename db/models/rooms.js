'use strict';

	/*
	|--------------------------------------------------------------------------
	| Bets Model v1.0
	|--------------------------------------------------------------------------
	| Author : Shinji Escorido
	|
	*/

module.exports = (sequelize, DataTypes) => {  
	const Rooms = sequelize.define('room', {
		id : {
			type          : DataTypes.INTEGER(10).UNSIGNED,
			primaryKey    : true,
			autoIncrement : true,
			allowNull     : false
		},
		table_id 	  : {type:DataTypes.INTEGER(10).UNSIGNED,allowNull:false},
		token         : {type:DataTypes.STRING(36),defaultValue:null},
		password      : {type:DataTypes.STRING(64),defaultValue:null},
		bet_range     : {type:DataTypes.STRING(20),defaultValue:null},
		//commission    : {type:DataTypes.DECIMAL(15,2),defaultValue:null},
		user_id 	  : {type:DataTypes.INTEGER(10).UNSIGNED,allowNull:false},
		players_cnt   : {type:DataTypes.INTEGER(6).UNSIGNED,allowNull:false},
		table_id 	  : {type:DataTypes.INTEGER(10).UNSIGNED,allowNull:false},
		active	  	  : {type:DataTypes.ENUM, values : ['0', '1'], defaultValue: null},
		title	      : DataTypes.STRING(30)
	});
	return Rooms;
}
