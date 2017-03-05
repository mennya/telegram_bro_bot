module.exports = process.env.NODE_ENV === 'development' ? process.env : require('../config.json');
