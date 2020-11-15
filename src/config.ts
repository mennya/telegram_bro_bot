const dotenv = require('dotenv');
dotenv.config({allowEmptyValues: true});

export const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MONGOLAB_URI: process.env.MONGOLAB_URI,
  PORT: process.env.PORT,
  ADMINS: process.env.ADMINS,
  SUPER_ADMIN: process.env.SUPER_ADMIN,
  HEROKU_URL: process.env.HEROKU_URL
};
