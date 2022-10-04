const Sequelize = require(`sequelize`);
const db = require('../config/database')

const storage = db.define('storage', 
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_item:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        total_weight:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        createdAt       : false,
        updatedAt       : false
    });

module.exports = storage;