const express = require('express');
const router = express.Router();
const item = require('../controllers/item');
const auth = require('../middleware/user')


router.get('/',auth,item.getItem);

router.post('/add',auth,item.saveItem);

router.post('/edit',auth,item.editItem);

router.post('/delete',auth,item.deleteItem);

module.exports= router;