const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const userMiddleware = require('../middlewares/userMiddleware');

router.use(userMiddleware);

router.get('/', categoryController.list);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
