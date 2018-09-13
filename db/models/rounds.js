'use strict';


/*
 |--------------------------------------------------------------------------
 | Rounds Model v1.0
 |--------------------------------------------------------------------------
 | Author : Shinji Escorido
 |
*/

module.exports = (sequelize, DataTypes) => {
	const Rounds = sequelize.define( 'round',{
		id :{
			type          : DataTypes.INTEGER(10).UNSIGNED,
			primaryKey    : true,
			autoIncrement : true,
			allowNull     : false
		},
		table_id: {
              type: DataTypes.INTEGER(10).UNSIGNED,
              references    : 'game_tables', // <<< Note, its table's name, not object name
              referencesKey : 'id', // <<< Note, its a column name
			  allowNull     : false
        },
		dealer_id : DataTypes.INTEGER(10).UNSIGNED,
		round_num : {
			type:DataTypes.INTEGER(10).UNSIGNED,
			allowNull:false
		},
		status : {
			type   : DataTypes.ENUM,
			values : ['S', 'E', 'H', 'P', 'W'],
			defaultValue: null
		},
		game_info   : DataTypes.JSON,
		game_result : DataTypes.JSON,
		modify_flag : {
			type   : DataTypes.ENUM,
			values : ['0','1'],
			defaultValue: null
		}
	});
	return Rounds;
};
