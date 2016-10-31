// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz',
	{	pregunta: DataTypes.STRING,
		respuesta: DataTypes.STRING,
		aciertos: DataTypes.INTEGER,
		aciertosConsecutivos: DataTypes.INTEGER,
		fallos: DataTypes.INTEGER,
	});
}