const m_users = require("../models/m_users");
const m_level = require("../models/m_level");
const sequelize = require("../config/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.SECRET_KEY;
const { Op } = require("sequelize");

module.exports = {
  getUser: async (req, res) => {
    try {
      m_level.hasMany(m_users, { foreignKey: "id_level" });
      m_users.belongsTo(m_level, { foreignKey: "id_level" });

      const users = await m_users.findAll({
        raw: true,
        include: [
          {
            model: m_level,
            attributes: [],
          },
        ],
        attributes: [
          sequelize.col("m_users.id"),
          sequelize.col("m_users.username"),
          sequelize.col("m_users.id_level"),
          [sequelize.col("m_level.name"), "description"],
        ],
      });

      res.status(200).json({
        message: "Berhasil Get User",
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Get User",
        error,
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      m_level.hasMany(m_users, { foreignKey: "id_level" });
      m_users.belongsTo(m_level, { foreignKey: "id_level" });

      const { username, password } = req.body;

      let user = await m_users.findOne({
        raw: true,
        attributes: [
          sequelize.col("m_users.*"),
          [sequelize.col("m_level.name"), "role"],
        ],
        include: [{ model: m_level, attributes: [] }],
        where: { username },
      });

      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Username Not Found",
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Wrong Password",
            },
          ],
        });
      }

      const payload = {
        user: {
          id_user: user.id,
          username: user.username,
          role: user.role
        },
      };

      jwt.sign(
        payload,
        JWT_KEY,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(404).json({
        message: "Error",
        error,
      });
    }
  },
  saveUser: async (req, res) => {
    const transaction = await sequelize.transaction();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { username, password, id_level } = req.body;
    try {
      let user = await m_users.findOne({ raw: true, where: { username } });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      user = await m_users.create(
        { username, password, id_level },
        { raw: true, returning: true, transaction }
      );

      const payload = {
        user: {
          id_user: user.id,
        },
      };

      await transaction.commit();
      jwt.sign(
        payload,
        JWT_KEY,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  },
  editUser: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      let { id, username, password, id_level } = req.body;

      let user = await m_users.findOne({
        raw: true,
        where: {
          username,
          id: { [Op.not]: id },
        },
      });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const editUser = await m_users.update(
        { username, password, id_level },
        {
          where: { id },
          returning: true,
          transaction,
        }
      );

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Di Edit!",
        editUser,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(404).json({
        message: "Error",
        error,
      });
    }
  },
  deleteUser: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id, username, password, level } = req.body;
      const editUser = await m_users.destroy({
        where: { id },
        returning: true,
        transaction,
      });

      await transaction.commit();
      res.status(200).json({
        message: "Berhasil Di Delete!",
        editUser,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(404).json({
        message: "Error",
        error,
      });
    }
  },
};
