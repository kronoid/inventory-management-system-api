const ExcelJS = require('exceljs');
const trans_in = require('../models/trans_in');
const m_item = require('../models/m_item');
const sequelize = require('sequelize');
const kiln_process = require('../models/kiln_process');
const sale = require('../models/sale');


module.exports = {
  excel_transaction: async (req, res) => {
    try {
        m_item.hasMany(trans_in, { foreignKey: "id_item" });
        trans_in.belongsTo(m_item, { foreignKey: "id_item" });
        const data = await trans_in.findAll({
            raw: true,
            include: [
              {
                model: m_item,
                attributes: [],
                where: { id_category: 1 },
              }
            ],
            attributes: [
              sequelize.col("trans_in.id"),
              sequelize.col("trans_in.id_item"),
              sequelize.col("trans_in.id_user"),
              sequelize.col("trans_in.delivery_note"),
              sequelize.col("trans_in.weight"),
              sequelize.col("m_item.name"),
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.mergeCells('A1:A5');
        worksheet.mergeCells('B1:D5');
        for(let i = 1; i <=5; i++){
            worksheet.getColumn(i).width = 30;
        }

        //Header
        const logo = workbook.addImage({
            filename:'./asset/logo_freeman.png',
            extension: 'png'
        });
        worksheet.addImage(logo,{
            tl: { col: 0, row: 1 },
            ext: { width: 226.8, height: 42.714 }
          });          
        worksheet.getCell('B1').value = `PT. Freeman Indonesia
        Email : info@freemancarbonindonesia.com | Telepon : +6221 7227413
        Jl. Panglima Polim V No. 22 RT.01/06 Kel. Melawai Kec.Kebayoran Baru Jakarta Selatan, Indonesia
        `;

        
        //table header
        worksheet.getCell('A6').value = `Item Name`;
        worksheet.getCell('B6').value = `Date In`;
        worksheet.getCell('C6').value = `Delivery Note`;
        worksheet.getCell('D6').value = `Weight`;

        //table content
        for(let i in data){
            worksheet.getCell(`B${Number(i)+7}`).value = data[i].date_in;
            worksheet.getCell(`A${Number(i)+7}`).value = data[i].name;
            worksheet.getCell(`C${Number(i)+7}`).value = data[i].delivery_note;
            worksheet.getCell(`D${Number(i)+7}`).value = data[i].weight;
        }
        
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell(function(cell, cellNumber){
                cell.font ={bold: rowNumber <= 6 ? true : false}
                cell.style.alignment = {vertical: 'middle', horizontal: rowNumber <= 6 ? 'center':'left', wrapText:true}

                cell.border = {
                    top: {style:'thin', color: {argb:'black'}},
                    left: {style:'thin', color: {argb:'black'}},
                    bottom: {style:'thin', color: {argb:'black'}},
                    right: {style:'thin', color: {argb:'black'}}
                };
            })
        });

        res.attachment(`Report Transaction.xlsx`);
        res.setHeader("Set-Cookie", "fileDownload=true; path=/");
        const buffer = await workbook.xlsx.writeBuffer();
        res.end(buffer);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Download Failed",
        error,
      });
    }
  },
  excel_kiln_process: async (req, res) => {
    try {        
        m_item.hasMany(kiln_process, { foreignKey: "id_item" });
        kiln_process.belongsTo(m_item, { foreignKey: "id_item" });

        const data = await kiln_process.findAll({
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.mergeCells('A1:A5');
        worksheet.mergeCells('B1:E5');
        worksheet.mergeCells('B6:C6');
        worksheet.mergeCells('D6:E6');
        for(let i = 1; i <=5; i++){            
            worksheet.getColumn(i).width = i === 1 ? 30 : 20;
        }

        //Header
        const logo = workbook.addImage({
            filename:'./asset/logo_freeman.png',
            extension: 'png'
        });
        worksheet.addImage(logo,{
            tl: { col: 0, row: 1 },
            ext: { width: 226.8, height: 42.714 }
          });          
        worksheet.getCell('B1').value = `PT. Freeman Indonesia
        Email : info@freemancarbonindonesia.com | Telepon : +6221 7227413
        Jl. Panglima Polim V No. 22 RT.01/06 Kel. Melawai Kec.Kebayoran Baru Jakarta Selatan, Indonesia
        `;

        
        //table header
        worksheet.getCell('A6').value = `Item Name`;
        worksheet.getCell('B6').value = `Weight`;
        worksheet.getCell('D6').value = `Date`;

        //table content
        for(let i in data){
            worksheet.mergeCells(`B${Number(i)+7}:C${Number(i)+7}`);
            worksheet.mergeCells(`D${Number(i)+7}:E${Number(i)+7}`);

            worksheet.getCell(`A${Number(i)+7}`).value = data[i].item_name;
            worksheet.getCell(`B${Number(i)+7}`).value = data[i].weight;
            worksheet.getCell(`D${Number(i)+7}`).value = data[i].date_at;
        }
        
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell(function(cell, cellNumber){
                cell.font ={bold: rowNumber <= 6 ? true : false}
                cell.style.alignment = {vertical: 'middle', horizontal: rowNumber <= 6 ? 'center':'left', wrapText:true}

                cell.border = {
                    top: {style:'thin', color: {argb:'black'}},
                    left: {style:'thin', color: {argb:'black'}},
                    bottom: {style:'thin', color: {argb:'black'}},
                    right: {style:'thin', color: {argb:'black'}}
                };
            })
        });

        res.attachment(`Report Kiln Process.xlsx`);
        const buffer = await workbook.xlsx.writeBuffer();
        res.end(buffer);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Download Failed",
        error,
      });
    }
  },
  excel_sale: async (req, res) => {
    try {
        m_item.hasMany(sale, { foreignKey: "id_item" });
        sale.belongsTo(m_item, { foreignKey: "id_item" });

        const data = await sale.findAll({
            raw: true,
            include: [
            {
                model: m_item,
                attributes: [],
                where: { id_category: 2 },
            },
            ],
            attributes: [
            sequelize.col("sale.id"),
            [sequelize.col(`m_item.name`), "item_name"],
            [sequelize.col(`m_item.id`), "id_item"],
            sequelize.col("sale.weight"),
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.mergeCells('A1:A5');
        worksheet.mergeCells('B1:E5');
        worksheet.mergeCells('B6:C6');
        worksheet.mergeCells('D6:E6');
        for(let i = 1; i <=5; i++){            
            worksheet.getColumn(i).width = i === 1 ? 30 : 20;
        }

        //Header
        const logo = workbook.addImage({
            filename:'./asset/logo_freeman.png',
            extension: 'png'
        });
        worksheet.addImage(logo,{
            tl: { col: 0, row: 1 },
            ext: { width: 226.8, height: 42.714 }
          });          
        worksheet.getCell('B1').value = `PT. Freeman Indonesia
        Email : info@freemancarbonindonesia.com | Telepon : +6221 7227413
        Jl. Panglima Polim V No. 22 RT.01/06 Kel. Melawai Kec.Kebayoran Baru Jakarta Selatan, Indonesia
        `;

        
        //table header
        worksheet.getCell('A6').value = `Item Name`;
        worksheet.getCell('B6').value = `Weight`;
        worksheet.getCell('D6').value = `Date`;

        //table content
        for(let i in data){
            worksheet.mergeCells(`B${Number(i)+7}:C${Number(i)+7}`);
            worksheet.mergeCells(`D${Number(i)+7}:E${Number(i)+7}`);

            worksheet.getCell(`A${Number(i)+7}`).value = data[i].item_name;
            worksheet.getCell(`B${Number(i)+7}`).value = data[i].weight;
            worksheet.getCell(`D${Number(i)+7}`).value = data[i].date;
        }
        
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell(function(cell, cellNumber){
                cell.font ={bold: rowNumber <= 6 ? true : false}
                cell.style.alignment = {vertical: 'middle', horizontal: rowNumber <= 6 ? 'center':'left', wrapText:true}

                cell.border = {
                    top: {style:'thin', color: {argb:'black'}},
                    left: {style:'thin', color: {argb:'black'}},
                    bottom: {style:'thin', color: {argb:'black'}},
                    right: {style:'thin', color: {argb:'black'}}
                };
            })
        });

        res.attachment(`Report Sale.xlsx`);
        const buffer = await workbook.xlsx.writeBuffer();
        res.end(buffer);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Download Failed",
        error,
      });
    }
  }
};
