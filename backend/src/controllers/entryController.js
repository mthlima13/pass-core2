const Entry = require('../models/Entry');
const encryptionService = require('../services/encryptionService');

exports.create = async (req, res) => {
  try {
    const { serviceName, username, password, url, notes, categoryId, favorite } = req.body;

    if (!serviceName || !username || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios: serviceName, username, password' });
    }

    // Criptografa a senha antes de salvar
    const encryptedPassword = encryptionService.encrypt(password);

    const entry = new Entry({
      userId: req.userId,
      serviceName,
      username,
      encryptedPassword,
      url,
      notes,
      categoryId: categoryId || undefined,
      favorite: favorite || false,
    });

    await entry.save();
    const populated = await entry.populate('categoryId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { search, favorite, categoryId, sort, order, page, limit } = req.query;

    // Filtros
    const filter = { userId: req.userId };

    if (favorite === 'true') filter.favorite = true;
    if (categoryId) filter.categoryId = categoryId;
    if (search) {
      filter.$or = [
        { serviceName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
      ];
    }

    // Ordenação
    const sortField = sort || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    // Paginação
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * pageSize;

    const [entries, total] = await Promise.all([
      Entry.find(filter)
        .populate('categoryId')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize),
      Entry.countDocuments(filter),
    ]);

    res.json({
      entries,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reveal = async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.userId });

    if (!entry) {
      return res.status(404).json({ error: 'Entrada não encontrada' });
    }

    const decryptedPassword = encryptionService.decrypt(entry.encryptedPassword);
    res.json({ password: decryptedPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.encryptedPassword = encryptionService.encrypt(password);
    }

    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    ).populate('categoryId');

    if (!entry) return res.status(404).json({ error: 'Entrada não encontrada' });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.userId });

    if (!entry) return res.status(404).json({ error: 'Entrada não encontrada' });

    entry.favorite = !entry.favorite;
    await entry.save();
    const populated = await entry.populate('categoryId');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ error: 'Entrada não encontrada' });
    res.json({ message: 'Entrada excluída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
