const express = require('express');
const router = express.Router();
const kiln = require('../controllers/kiln');
const auth = require('../middleware/user');

router.get('/',auth,kiln.getKiln);

router.post('/add',auth,kiln.saveKiln);

router.post('/edit',auth,kiln.editKiln);

router.post('/delete',auth,kiln.deleteKiln);

module.exports= router;