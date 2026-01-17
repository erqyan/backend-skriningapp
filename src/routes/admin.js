const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const c = require('../controllers/adminController');

router.get('/hasil', auth, admin, c.getAllHasil);

module.exports = router;
