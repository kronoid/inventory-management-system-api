const formula = require("../models/formula");
const m_category = require("../models/m_category");
const m_item = require("../models/m_item");
const storage = require("../models/storage");
const sequelize = require("../config/database");

module.exports = {
  getItem: async (req, res) => {
    try {
      m_category.hasMany(m_item, { foreignKey: "id_category" });
      m_item.belongsTo(m_category, { foreignKey: "id_category" });

      const formulas = await formula.findAll({ raw: true });
      const categorys = await m_category.findAll({ raw: true });
      const raws = await m_item.findAll({
        raw: true,
        where: { id_category: 1 },
      });
      let items = await m_item.findAll({
        raw: true,
        include: [
          {
            model: m_category,
            attributes: [],
          },
        ],
        attributes: [
          sequelize.col("m_item.id"),
          sequelize.col("m_item.name"),
          sequelize.col("m_item.id_category"),
          [sequelize.col("m_category.name"), "description"],
        ],
      });

      //restructure items
      items.forEach((item, i) => {
        const form = formulas.find((formula) => formula.id_header === item.id);
        if (form) {
          items[i].id_raw = form.id_raw;
        }
      });

      res.status(200).json({
        message: "Berhasil Get Item",
        items,
        categorys,
        raws,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Get Item",
        error,
      });
    }
  },
  saveItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { name, id_category, id_raw } = req.body;

      const saveItem = await m_item.create(
        { name, id_category },
        { returning: true, transaction }
      );
      await storage.create(
        { id_item: saveItem.id, total_weight: 0 },
        { transaction }
      );
      if (id_category == 2)
        await formula.create(
          { id_header: saveItem.id, id_raw },
          { transaction }
        );

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Save Item",
        saveItem,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Save Item",
        error,
      });
    }
  },
  editItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id, name, id_category, id_raw } = req.body;

      const editItem = await m_item.update(
        { id, name, id_category },
        {
          where: { id },
          returning: true,
          transaction,
        }
      );

      if (Number(id_category) === 2) {
        await formula.update(
          { id_raw },
          { where: { id_header: id }, transaction }
        );
      }

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Edit Item",
        editItem,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Edit Item",
        error,
      });
    }
  },
  deleteItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.body;

      const deleteItem = await m_item.destroy({
        where: { id },
        returning: true,
        transaction,
      });

      await formula.destroy({
        where: { id_header: id },
        transaction,
      });

      await storage.destroy({
        where: { id_item: id },
        transaction,
      });

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Delete Item",
        deleteItem,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(500).json({
        message: "Error Delete Item",
        error,
      });
    }
  },
};
