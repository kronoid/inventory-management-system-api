const Sequelize = require(`sequelize`);
const db = require('../config/database')

const formula = db.define('formula', 
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_header:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_raw:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        createdAt       : false,
        updatedAt       : false
    });

module.exports = formula;