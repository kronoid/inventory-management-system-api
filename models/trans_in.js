const Sequelize = require(`sequelize`);
const db = require("../config/database");

const trans_in = db.define(
  "trans_in",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_item: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date_in: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    delivery_note: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = trans_in;
