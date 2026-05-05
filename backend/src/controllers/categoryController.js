const Category = require('../models/Category');

exports.list = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
    }

    const existing = await Category.findOne({ userId: req.userId, name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Categoria já existe' });
    }

    const category = new Category({
      userId: req.userId,
      name: name.trim(),
      icon: icon || 'folder',
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (icon) updateData.icon = icon;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ message: 'Categoria excluída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
