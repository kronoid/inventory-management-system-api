const Sequelize = require(`sequelize`);
const db = require('../config/database')

const m_item = db.define('m_item', 
    {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name:{
            type: Sequelize.STRING,
            allowNull: false
        },
        id_category:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        createdAt       : false,
        updatedAt       : false
    });

module.exports = m_item;