const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const c = require('../controllers/adminController');

router.get('/hasil', auth, admin, c.getAllHasil);
router.post('/pertanyaan', auth, admin, c.createPertanyaan);
router.put('/pertanyaan/:id', auth, admin, c.updatePertanyaan);
router.delete('/pertanyaan/:id', auth, admin, c.deletePertanyaan);

module.exports = router;
