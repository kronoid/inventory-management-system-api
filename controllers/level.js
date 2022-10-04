const m_level = require('../models/m_level');
const sequelize = require('../config/database');

module.exports = {
    getLevel : async (req, res) => {
        try{
            const levels = await m_level.findAll({raw:true});
            res.status(200).json({
                message: 'Berhasil Get Level',
                levels
            })
        }catch(error){
            console.log(error)
            res.status(500).json({
                message: 'Error Get Level',
                error
            })
        }
    },
    saveLevel : async (req, res) => {
        const transaction = await sequelize.transaction();
        try{
            const {name, description} = req.body;

            const saveLevel = await m_level.create({name, description},{returning:true, transaction});

            await transaction.commit();
            res.status(200).json({
                message: 'Berhasil Save Level',
                saveLevel
            })
        }catch(error){
            console.log(error)
            await transaction.rollback();
            res.status(500).json({
                message: 'Error Save Level',
                error
            })
        }
    },
    editLevel : async (req, res) => {
        const transaction = await sequelize.transaction();
        try{
            const {id, name, description} = req.body;

            const editLevel = await m_level.update({id, name, description},{
                where: {id},
                returning:true,
                transaction
            });

            await transaction.commit();
            res.status(200).json({
                message: 'Berhasil Edit Level',
                editLevel
            })
        }catch(error){
            console.log(error)
            await transaction.rollback();
            res.status(500).json({
                message: 'Error Edit Level',
                error
            })
        }
    },
    deleteLevel : async (req, res) => {
        const transaction = await sequelize.transaction();
        try{
            const {id} = req.body;

            const deleteLevel = await m_level.destroy({
                where: {id},
                returning:true,
                transaction
            });

            await transaction.commit();
            res.status(200).json({
                message: 'Berhasil Delete Level',
                deleteLevel
            })
        }catch(error){
            console.log(error)
            await transaction.rollback();
            res.status(500).json({
                message: 'Error Delete Level',
                error
            })
        }
    }
}
