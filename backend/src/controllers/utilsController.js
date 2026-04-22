const { generatePassword } = require('../utils/passwordGenerator');

exports.generate = (req, res) => {
  const { length, numbers, symbols, uppercase } = req.query;
  
  const password = generatePassword(
    length ? parseInt(length) : 16,
    {
      numbers: numbers !== 'false',
      symbols: symbols !== 'false',
      uppercase: uppercase !== 'false'
    }
  );
  
  res.json({ password });
};
