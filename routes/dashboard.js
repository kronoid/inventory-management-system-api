const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboard");
const auth = require("../middleware/user");

router.get("/", auth, dashboard.getDashboard);

module.exports = router;
