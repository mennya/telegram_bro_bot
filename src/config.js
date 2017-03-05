module.exports = process.env.NODE_ENV === 'production' ? process.env : require('../config.json');
