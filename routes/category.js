const express = require('express');
const router = express.Router();
const category = require('../controllers/category');
const auth = require('../middleware/user');

router.get('/',auth,category.getCategory);

router.post('/add',auth,category.saveCategory);

router.post('/edit',auth,category.editCategory);

router.post('/delete',auth,category.deleteCategory);

module.exports= router;