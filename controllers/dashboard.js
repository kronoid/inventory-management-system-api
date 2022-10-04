const m_item = require("../models/m_item");
const storage = require("../models/storage");
const sale = require("../models/sale");
const sequelize = require("../config/database");

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const dataItem = await m_item.findAll({ raw: true });
      const dataStorage = await storage.findAll({ raw: true });
      const dataSales = await sale.findAll({ raw: true });

      //restructure

      let raw_materials = [];
      let production_goods = [];
      let production_goods_sold = [];
      let total_production_goods = 0;
      let total_production_goods_sold = 0;
      let notif;

      dataItem.forEach((item) => {
        let itemStorage = dataStorage.find((data) => data.id_item === item.id);
        if (item.id_category === 1) {
          notif = itemStorage.total_weight > 56315 ? `Available stock is safe` : `Stock is running low, time to buy Raw Material`;
          raw_materials.push({
            ...item,
            notif,
            weight: itemStorage.total_weight,
          });
        } else {
          total_production_goods += itemStorage.total_weight;
          production_goods.push({
            ...item,
            weight: itemStorage.total_weight,
          });
          production_goods_sold.push({...item, weight:0});
          for(let i in dataSales){
            if(dataSales[i].id_item == item.id){
              let index = production_goods_sold.findIndex(item => item.id == dataSales[i].id_item);
              production_goods_sold[index].weight += Number(dataSales[i].weight);
              total_production_goods_sold += Number(dataSales[i].weight);
            }
          }
        }
      });

      res.status(200).json({
        message: "Berhasil Get Dashboard",
        raw_materials,
        production_goods,
        production_goods_sold,
        total_production_goods,
        total_production_goods_sold,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Get Dashboard",
        error,
      });
    }
  },
};
