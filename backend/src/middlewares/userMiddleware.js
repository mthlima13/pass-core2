module.exports = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Header x-user-id is required' 
    });
  }
  
  req.userId = userId;
  next();
};
