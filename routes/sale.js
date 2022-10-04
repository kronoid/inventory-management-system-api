const express = require("express");
const router = express.Router();
const sale = require("../controllers/sale");
const auth = require("../middleware/user");

router.get("/", auth, sale.getSale);

router.post("/add", auth, sale.saveSale);

// router.post("/edit", auth, sale.editTransaction);

router.post("/delete", auth, sale.deleteSale);

module.exports = router;
