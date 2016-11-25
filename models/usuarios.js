// Definicion del modelo de Usuarios

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('autenticaTabla',
	{	username: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre Usuario"}}	
		}, 
		password: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Password"}}	
		} 
	});
}