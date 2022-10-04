const m_category = require('../models/m_category');
const sequelize = require('../config/database');

module.exports = {
    getCategory : async (req, res) => {
        try{
            const categorys = await m_category.findAll({raw:true});
            res.status(200).json({
                message: 'Berhasil Get Category',
                categorys
            })
        }catch(error){
            console.log(error)
            res.status(500).json({
                message: 'Error Get Category',
                error
            })
        }
    },
    saveCategory : async (req, res) => {
        const transaction = await sequelize.transaction();
        try{
            const {name, description} = req.body;

            const saveCategory = await m_category.create({name, description},{returning:true, transaction});

            await transaction.commit();
            res.status(200).json({
                message: 'Berhasil Save Category',
                saveCategory
            })
        }catch(error){
            console.log(error)
            await transaction.rollback();
            res.status(500).json({
                message: 'Error Save Category',
                error
            })
        }
    },
    editCategory : async (req, res) => {
        const transaction = await sequelize.transaction();
        try{
            const {id, name, description} = req.body;

            const editCategory = await m_category.update({id, name, description},{
                where: {id},
                returning:true,
                transaction
            });

            await transaction.commit();
            res.status(200).json({
                message: 'Berhasil Edit Category',
                editCategory
            })
        }catch(error){
            console.log(error)
            await transaction.rollback();
            res.status(500).json({
                message: 'Error Edit Category',
                error
            })
        }
    },
    deleteCategory : async (req, res) => {
        const transaction = await sequelize.transaction();
        try{
            const {id} = req.body;

            const deleteCategory = await m_category.destroy({
                where: {id},
                returning:true,
                transaction
            });

            await transaction.commit();
            res.status(200).json({
                message: 'Berhasil Delete Category',
                deleteCategory
            })
        }catch(error){
            console.log(error)
            await transaction.rollback();
            res.status(500).json({
                message: 'Error Delete Category',
                error
            })
        }
    }
}
