const express = require('express');
const { getFoods } = require('../controllers/foodController');
const { addFood, updateFood, deleteFood } = require('../controllers/foodController');  // Thêm các controller mới

const router = express.Router();

router.get('/', getFoods);
router.post('/', addFood); // Route thêm món ăn
router.put('/:id', updateFood); // Route sửa món ăn
router.delete('/:id', deleteFood); // Route xóa món ăn

module.exports = router;
