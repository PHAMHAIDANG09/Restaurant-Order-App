const Food = require('../models/Food');

// Lấy tất cả món ăn
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm món ăn
const addFood = async (req, res) => {
  const { name, price, image } = req.body;

  const newFood = new Food({
    name,
    price,
    image
  });

  try {
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật món ăn
const updateFood = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const food = await Food.findByIdAndUpdate(id, { name, price, image }, { new: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa món ăn
const deleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findByIdAndDelete(id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFoods, addFood, updateFood, deleteFood };
