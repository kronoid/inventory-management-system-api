const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const user = require('../controllers/user');
const auth = require('../middleware/user');

router.post('/login',[
    check('username','Username dibutuhkan').exists(),
    check('password','Password dibutuhkan').exists()
],user.loginUser);

router.get('/',auth,user.getUser);

router.post('/add',auth,user.saveUser);

router.post('/edit',auth,user.editUser);

router.post('/delete',auth,user.deleteUser);

module.exports= router;