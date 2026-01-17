const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const c = require('../controllers/skriningController');

router.get('/pertanyaan', auth, c.getPertanyaan);
router.post('/jawab', auth, c.submitJawaban);
router.get('/hasil', auth, c.getHasil);

module.exports = router;
