'use strict';

	/*
	|--------------------------------------------------------------------------
	| Vendors Model v1.0
	|--------------------------------------------------------------------------
	| Author : Shinji Escorido
	|
	*/
	
module.exports = (sequelize, DataTypes) => {  
	const Vendors = sequelize.define('vendor', {
		id : {
			type          : DataTypes.INTEGER(8).UNSIGNED,
			primaryKey    : true,
			autoIncrement : true,
			allowNull     : false
		},
		vendor_name : {
			allowNull: true,
			type : DataTypes.CHAR(60)
		},
		type : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['sports','casino','none'],
			defaultValue : 'casino'
		},
		deployment_type : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['live','demo'],
			defaultValue : 'live'
		},
		integration_type : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['seamless','transfer'],
			defaultValue : 'transfer'
		},
		lobby_type : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['nihtan','integrated'],
			defaultValue : 'nihtan'
		},
		parent_id : {
			type : DataTypes.INTEGER(8).UNSIGNED,
			allowNull: true,
			defaultValue : null
		},
		ip_address: {
			type: DataTypes.STRING(45),
			allowNull : true,
			defaultValue : null
		},
		public_key : {
			type: DataTypes.STRING(256),
			allowNull: true,
			defaultValue : null,
			unique: true
		},
		secret_key : {
			type: DataTypes.STRING(256),
			allowNull: true,
			defaultValue : null
		},
		check_url : {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		transfer_url : {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		transaction_url : {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		history_url : {
			type: DataTypes.STRING(256),
			allowNull: false,
			defaultValue : ""
		},
		session_url : {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		egg : {
			type: DataTypes.DECIMAL(15,2).UNSIGNED,
			allowNull: true,
			defaultValue: 0.00
		},
		egg_ratio : {
			type: DataTypes.DECIMAL(4,2),
			defaultValue: 0.00,
			allowNull:true		
		},
		egg_slot : {
			type: DataTypes.DECIMAL(15,2).UNSIGNED,
			allowNull: true,
			defaultValue: 0.00
		},
		egg_slot_ratio : {
			type: DataTypes.DECIMAL(4,2),
			defaultValue: 0.00,
			allowNull:true		
		},
		reel_active : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['0','1'],
			defaultValue : '1'
		},
		is_active : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['0','1'],
			defaultValue : '1'
		},
		bsg_token : {
			type: DataTypes.STRING(256),
			allowNull: true
		},
		bsg_bank_id : {
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		lang: {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['korea','english','japan','chinese'],
			defaultValue : 'korea'
		},
		reel_yn : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['0','1'],
			defaultValue : '0'
		},
		multiplier : {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue : 1000
		},
		main_multiplier : {
			type: DataTypes.INTEGER(4).UNSIGNED,
			allowNull: true,
			defaultValue : 100
		},
		currency : {
			allowNull: true,
			type : DataTypes.ENUM,
			values : ['CNY','USD','JPY','KRW','THB','MYR','IDR','PTS'],
			defaultValue : 'KRW'
		}
	});
	return Vendors;
}
