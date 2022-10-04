const m_item = require("../models/m_item");
const m_users = require("../models/m_users");
const storage = require("../models/storage");
const trans_in = require("../models/trans_in");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const formula = require("../models/formula");

module.exports = {
  getTransaction: async (req, res) => {
    try {
      m_item.hasMany(trans_in, { foreignKey: "id_item" });
      trans_in.belongsTo(m_item, { foreignKey: "id_item" });

      m_users.hasMany(trans_in, { foreignKey: "id_user" });
      trans_in.belongsTo(m_users, { foreignKey: "id_user" });

      const transactions = await trans_in.findAll({
        raw: true,
        include: [
          {
            model: m_item,
            attributes: [],
            where: { id_category: 1 },
          },
          {
            model: m_users,
            attributes: [],
          },
        ],
        attributes: [
          sequelize.col("trans_in.id"),
          sequelize.col("trans_in.id_item"),
          sequelize.col("trans_in.id_user"),
          sequelize.col("trans_in.delivery_note"),
          sequelize.col("trans_in.weight"),
          sequelize.col("m_item.name"),
          sequelize.col("m_user.username"),
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("trans_in.date_in"),
              "%d-%m-%Y %H:%i"
            ),
            "date_in",
          ],
        ],
      });

      const items = await m_item.findAll({
        raw: true,
        where: { id_category: 1 },
      });

      res.status(200).json({
        message: "Berhasil Get Transaction",
        items,
        transactions,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Get Transaction",
        error,
      });
    }
  },
  saveTransaction: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { date_in, delivery_note, id_item, id_user, weight } = {
        ...req.body,
        ...req.user,
      };

      const data_storage = await storage.findOne({
        raw: true,
        where: { id_item },
      });

      let total_weight = data_storage.total_weight + Number(weight);

      await storage.update(
        {
          total_weight,
        },
        {
          where: { id: data_storage.id },
          transaction,
        }
      );

      const saveTransaction = await trans_in.create(
        { id_item, date_in, id_user, delivery_note, weight },
        { returning: true, transaction }
      );

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Save Transaction",
        saveTransaction,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Save Transaction",
        error,
      });
    }
  },
  //   editTransaction: async (req, res) => {
  //     const transaction = await sequelize.transaction();
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
  //           transaction,
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

  //       await transaction.commit();
  //       res.status(200).json({
  //         message: "Berhasil Edit Kiln",
  //         editKiln,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       await transaction.rollback();
  //       res.status(500).json({
  //         message: "Error Edit Kiln",
  //         error,
  //       });
  //     }
  //   },
  deleteTransaction: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.body;

      const dataTrans = await trans_in.findOne({ raw: true, where: { id } });

      const dataStorage = await storage.findOne({
        raw: true,
        where: { id_item: dataTrans.id_item },
      });

      let total_weight = dataStorage.total_weight - dataTrans.weight;

      await storage.update(
        { total_weight },
        { where: { id: dataStorage.id }, transaction }
      );

      const deleteTrans = await trans_in.destroy({
        where: { id },
        returning: true,
        transaction,
      });

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Delete Transaction",
        deleteTrans,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Delete Transaction",
        error,
      });
    }
  },
};
