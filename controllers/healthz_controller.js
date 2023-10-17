const sequelize = require('../connection');

const healthCheckMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
      res.status(405).json();
      return;
    }
    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
      return res.status(400).json({ message: 'Request body not allowed' });
    }
    next();
};  

const gethealthCheckController = async (req, res) => {
    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
        return res.status(400).json({ message: 'Request body not allowed' });
    }
    if (req.params.id !== undefined) {
      return res.status(404).json();
    }
    try {
        await sequelize.authenticate();
        res.set('cache-control', 'no-cache');
        res.status(200).json();
      } catch (error) {
        res.status(503).json();
      }
};

module.exports = {
    gethealthCheckController,
    healthCheckMiddleware
}