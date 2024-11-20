const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied.');

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(user.role)) return res.status(403).send('Forbidden.');
      req.user = user;
      next();
    } catch (err) {
      res.status(400).send('Invalid token.');
    }
  };
};