const express = require('express');
const router = express.Router();
const level = require('../controllers/level');
const auth = require('../middleware/user');

router.get('/',auth,level.getLevel);

router.post('/add',auth,level.saveLevel);

router.post('/edit',auth,level.editLevel);

router.post('/delete',auth,level.deleteLevel);

module.exports= router;