const m_item = require("../models/m_item");
const m_users = require("../models/m_users");
const storage = require("../models/storage");
const sale = require("../models/sale.js");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const formula = require("../models/formula");

module.exports = {
  getSale: async (req, res) => {
    try {
      m_item.hasMany(sale, { foreignKey: "id_item" });
      sale.belongsTo(m_item, { foreignKey: "id_item" });

      m_users.hasMany(sale, { foreignKey: "id_user" });
      sale.belongsTo(m_users, { foreignKey: "id_user" });

      const sales = await sale.findAll({
        raw: true,
        include: [
          {
            model: m_item,
            attributes: [],
            where: { id_category: 2 }, 
          },
          {
            model: m_users,
            attributes: [],
          },
        ],
        attributes: [
          sequelize.col("sale.id"),
          sequelize.col("sale.id_item"),
          sequelize.col("sale.id_user"),
          sequelize.col("sale.weight"),
          [sequelize.col("m_item.name"),'name_item'],
          sequelize.col("m_user.username"),
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("sale.date"),
              "%d-%m-%Y %H:%i"
            ),
            "date",
          ],
        ],
      });

      const items = await m_item.findAll({
        raw: true,
        where: { id_category: 2 },
      });

      res.status(200).json({
        message: "Berhasil Get Sale",
        items,
        sales,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Get sale",
        error,
      });
    }
  },
  saveSale: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { date, id_item, id_user, weight } = {
        ...req.body,
        ...req.user,
      };

      const data_storage = await storage.findOne({
        raw: true,
        where: { id_item },
      });

      let total_weight = data_storage.total_weight - Number(weight);

      await storage.update(
        {
          total_weight,
        },
        {
          where: { id: data_storage.id },
          transaction,
        }
      );

      const saveSale = await sale.create(
        { id_item, date, id_user, weight },
        { returning: true, transaction }
      );

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Save sale",
        saveSale,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Save sale",
        error,
      });
    }
  },
  //   editsale: async (req, res) => {
  //     const sale = await sequelize.sale();
  //     try {
  //       const { id, id_item, weight, date_at } = req.body;

  //       //data before edit
  //       const data_kiln = await kiln_process.findOne({
  //         raw: true,
  //         where: { id },
  //       });
  //       let new_weight;
  //       if (Number(weight) > data_kiln.weight) {
  //       } else {
  //       }

  //       const editKiln = await kiln_process.update(
  //         { id_item, weight, date_at },
  //         {
  //           where: { id },
  //           returning: true,
  //           sale,
  //         }
  //       );

  //       const data_storage = await storage.findOne({
  //         raw: true,
  //         where: { id_item },
  //       });
  //       let total_weight = data_storage.total_weight - Number(weight);
  //       await storage.update(
  //         { total_weight },
  //         { where: { id: data_storage.id } }
  //       );

  //       await sale.commit();
  //       res.status(200).json({
  //         message: "Berhasil Edit Kiln",
  //         editKiln,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       await sale.rollback();
  //       res.status(500).json({
  //         message: "Error Edit Kiln",
  //         error,
  //       });
  //     }
  //   },
  deleteSale: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.body;

      const dataSell = await sale.findOne({ raw: true, where: { id } });

      const dataStorage = await storage.findOne({
        raw: true,
        where: { id_item: dataSell.id_item },
      });

      let total_weight = dataStorage.total_weight - dataSell.weight;

      await storage.update(
        { total_weight },
        { where: { id: dataStorage.id }, transaction }
      );

      const deleteSell = await sale.destroy({
        where: { id },
        returning: true,
        transaction,
      });

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Delete sale",
        deleteSell,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Delete sale",
        error,
      });
    }
  },
};
