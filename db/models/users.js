'use strict';

	/*
	|--------------------------------------------------------------------------
	| users Model v1.0
	|--------------------------------------------------------------------------
	| Author : Shinji Escorido
	|
	*/

module.exports = (sequelize, DataTypes) => {  
	const Users = sequelize.define('user', {
		id : {
			type          : DataTypes.INTEGER(10).UNSIGNED,
			primaryKey    : true,
			autoIncrement : true,
			allowNull     : false
		},
		vendor_id : {
			type : DataTypes.INTEGER(8).UNSIGNED,
			allowNull: false
		},
		parent_id : {
			type : DataTypes.INTEGER(9).UNSIGNED,
			allowNull: false
		},
		user_id : {
			allowNull: false,
			type : DataTypes.STRING(20)
		},
		user_name : {
			allowNull: false,
			type : DataTypes.STRING(60)
		},
		authority : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['a','u'],
			defaultValue: 'u'
		
		},
		token : {
			defaultValue: null,
			type : DataTypes.STRING(256)
		},
		kaga_token : {
			defaultValue: null,
			type : DataTypes.STRING(128)
		},
		bsg_token : {
			defaultValue: null,
			type : DataTypes.STRING(128)
		},
		password : {
			type : DataTypes.STRING(255)
		},
		money : {
			defaultValue: null,
			type : DataTypes.DOUBLE(15,2)
		},
		reel_money : {
			defaultValue: null,
			type : DataTypes.DOUBLE(15,2)
		},
		is_active : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['0','1']
		},
		is_online : {
			allowNull: false,
			type : DataTypes.ENUM,
			values : ['0','1']
		},
		user_type : {
			type : DataTypes.ENUM,
			values: ['TC','TS','C','S'],
			defaultValue : 'C'
		},
		created_country : {
			type: DataTypes.STRING(60),
			defaultValue : null
		},
		connect_country : {
			type: DataTypes.STRING(60),
			defaultValue : null
		},
		configs : {
			type: DataTypes.STRING(512),
			allowNull : false,
			defaultValue : '{"avarta":{"customer":{"enabled":"false","image_url":""}, "video": "HD","default":{"select":"1","data":["red_king","red_queen","red_jack","red_joker","blue_king","blue_queen","blue_jack","blue_joker"]},"language":{"select":"2","data":["english","japan","korea","chinese"]},"sound":{"voice":"1","effect":"1","volum":"0.5"},"screen":{"select":"1","data":["black","white"]}}}'
		},
		connect_ip : {
			type: DataTypes.STRING(15),
			allowNull : false
		},
		created_ip : {
			type: DataTypes.STRING(15),
			allowNull : false
		},
		deleted_at : {
			type: DataTypes.DATE,
			defaultValue : null
		},
		currency : {
			allowNull: true,
			type : DataTypes.ENUM,
			values: ['CNY','USD','JPY','KRW','THB','MYR','IDR'],
			defaultValue : null
		},
		remember_token        : {type:DataTypes.STRING(256),defaultValue : null},
		mo_redirect_url       : {type:DataTypes.STRING(256),defaultValue : null},
		pc_redirect_url       : {type:DataTypes.STRING(256),defaultValue : null},
		transfer_callback_url : {type:DataTypes.STRING(256),defaultValue : null},
		multiplier : {
			type: DataTypes.INTEGER(4),
			defaultValue : '1'
		},
		denomination : {
			type: DataTypes.INTEGER(8),
			allowNull : true,
			defaultValue : null
		}
	});
	return Users;
}
