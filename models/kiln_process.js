const Sequelize = require(`sequelize`);
const db = require('../config/database')

const kiln_process = db.define('kiln_process', 
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
        weight:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        date_at:{
            type: Sequelize.DATE,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        createdAt       : false,
        updatedAt       : false
    });

module.exports = kiln_process;