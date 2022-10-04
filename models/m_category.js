const Sequelize = require(`sequelize`);
const db = require('../config/database')

const m_category = db.define('m_category', 
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
        description:{
            type: Sequelize.STRING,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        createdAt       : false,
        updatedAt       : false
    });

module.exports = m_category;