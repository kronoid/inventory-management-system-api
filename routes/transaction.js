const express = require("express");
const router = express.Router();
const transaction = require("../controllers/transaction");
const auth = require("../middleware/user");

router.get("/", auth, transaction.getTransaction);

router.post("/add", auth, transaction.saveTransaction);

// router.post("/edit", auth, transaction.editTransaction);

router.post("/delete", auth, transaction.deleteTransaction);

module.exports = router;
