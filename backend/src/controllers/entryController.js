const Entry = require('../models/Entry');
const encryptionService = require('../services/encryptionService');

exports.create = async (req, res) => {
  try {
    const { serviceName, username, password, url, notes, categoryId } = req.body;
    
    // Criptografa a senha antes de salvar
    const encryptedPassword = encryptionService.encrypt(password);
    
    const entry = new Entry({
      userId: req.userId,
      serviceName,
      username,
      encryptedPassword,
      url,
      notes,
      categoryId
    });
    
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.userId }).populate('categoryId');
    // Não descriptografamos aqui para segurança (só via reveal)
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reveal = async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
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
    );
    
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
