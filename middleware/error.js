const errorHandler = (err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
};

module.exports = errorHandler;
