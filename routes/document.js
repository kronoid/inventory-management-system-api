const express = require('express');
const router = express.Router();
const document = require('../controllers/document');
const auth = require('../middleware/user')


router.get('/transaction',document.excel_transaction);

router.get('/kiln_process',document.excel_kiln_process);
router.get('/sale',document.excel_sale);
module.exports= router;