const kiln_process = require("../models/kiln_process");
const m_item = require("../models/m_item");
const storage = require("../models/storage");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const formula = require("../models/formula");

module.exports = {
  getKiln: async (req, res) => {
    try {
      m_item.hasMany(kiln_process, { foreignKey: "id_item" });
      kiln_process.belongsTo(m_item, { foreignKey: "id_item" });

      const kilns = await kiln_process.findAll({
        raw: true,
        include: [
          {
            model: m_item,
            attributes: [],
            where: { id_category: 2 },
          },
        ],
        attributes: [
          sequelize.col("kiln_process.id"),
          [sequelize.col(`m_item.name`), "item_name"],
          [sequelize.col(`m_item.id`), "id_item"],
          sequelize.col("kiln_process.weight"),
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("kiln_process.date_at"),
              "%d-%m-%Y %H:%i"
            ),
            "date_at",
          ],
        ],
      });

      let items = await m_item.findAll({
        raw: true,
        where: { id_category: 2 },
      });

      const id_raw = items.map((item) => {return item.id});

      const formulaa = await formula.findAll({
        raw: true,
        where: {id_header : id_raw}
      });

      const stock = await storage.findAll({
        raw: true,
        where: {id_item : formulaa.map((fm)=>{return fm.id_raw})}
      });

      for(let i in items){
        let raw = formulaa.find(fm => fm.id_header === items[i].id);
        let stock_raw = stock.find(st => st.id_item === raw.id_raw);
        items[i].stock_raw = stock_raw.total_weight;
      };

      res.status(200).json({
        message: "Berhasil Get Kiln",
        kilns,
        items,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Get Kiln",
        error,
      });
    }
  },
  saveKiln: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id_item, weight, date_at } = req.body;

      const data_formula = await formula.findOne({
        raw: true,
        where: { id_header: id_item },
      });

      const data_storage = await storage.findAll({
        raw: true,
        where: { id_item: { [Op.in]: [id_item, data_formula.id_raw] } },
      });

      for (let i in data_storage) {
        let total_weight;
        if (data_storage[i].id_item == id_item) {
          total_weight = data_storage[i].total_weight + Number(weight);
        } else {
          total_weight = data_storage[i].total_weight - Number(weight);
          if (total_weight < 0) {
            await transaction.rollback();
            res.status(200).json({
              message: "Raw Material tidak cukup",
            });
          }
        }
        await storage.update(
          { total_weight },
          { where: { id: data_storage[i].id }, transaction }
        );
      }

      const saveKiln = await kiln_process.create(
        { id_item, weight, date_at },
        { returning: true, transaction }
      );

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Save Kiln",
        saveKiln,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Save Kiln",
        error,
      });
    }
  },
  editKiln: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id, id_item, weight, date_at } = req.body;

      //data before edit
      const data_kiln = await kiln_process.findOne({
        raw: true,
        where: { id },
      });
      let new_weight;
      if (Number(weight) > data_kiln.weight) {
      } else {
      }

      const editKiln = await kiln_process.update(
        { id_item, weight, date_at },
        {
          where: { id },
          returning: true,
          transaction,
        }
      );

      const data_storage = await storage.findOne({
        raw: true,
        where: { id_item },
      });
      let total_weight = data_storage.total_weight - Number(weight);
      await storage.update(
        { total_weight },
        { where: { id: data_storage.id } }
      );

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Edit Kiln",
        editKiln,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Edit Kiln",
        error,
      });
    }
  },
  deleteKiln: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.body;

      const dataKiln = await kiln_process.findOne({ raw: true, where: { id } });
      const form = await formula.findOne({
        raw: true,
        where: { id_header: dataKiln.id_item },
      });

      const data_storage = await storage.findAll({
        raw: true,
        where: { id_item: { [Op.in]: [form.id_header, form.id_raw] } },
      });

      for (let i in data_storage) {
        let total_weight;
        if (data_storage[i].id_item == dataKiln.id_item) {
          total_weight = data_storage[i].total_weight - dataKiln.weight;
        } else {
          total_weight = data_storage[i].total_weight + dataKiln.weight;
        }
        await storage.update(
          { total_weight },
          { where: { id: data_storage[i].id }, transaction }
        );
      }

      const deleteKiln = await kiln_process.destroy({
        where: { id },
        returning: true,
        transaction,
      });

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Delete Kiln",
        deleteKiln,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Delete Kiln",
        error,
      });
    }
  },
};
