'use strict';

	/*
	|--------------------------------------------------------------------------
	| Dealers Model v1.0
	|--------------------------------------------------------------------------
	| Author : Shinji Escorido
	|
	*/

module.exports = (sequelize, DataTypes) => {  
  const Dealers = sequelize.define('dealer', {
    id : {
      type          : DataTypes.INTEGER(10).UNSIGNED,
      primaryKey    : true,
      autoIncrement : true,
      allowNull     : false
    },
	code          : DataTypes.STRING(10),
	name          : DataTypes.STRING(30),
	real_name     : DataTypes.STRING(30),
	dealer_images : DataTypes.BLOB,
	dealer_image  : DataTypes.STRING(255),
	table_image   : DataTypes.STRING(255),
	table_name    : DataTypes.STRING(20),
	status : {
		type   : DataTypes.ENUM,
		values : ['0', '1']	
	}
  });
  return Dealers;
};
