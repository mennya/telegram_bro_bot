import * as fs from 'fs';

interface IConf {
  /**
   * token from BotFather https://telegram.me/botfather
   */
  BOT_TOKEN: string;
  /**
   * An url to connect database
   */
  MONGOLAB_URI: string;
  /**
   * Port to run http server locally, heroku set's PORT env variable automatically
   */
  PORT: string;
  /**
   * Users id's who can edit answers
   */
  ADMINS: string;
  /**
   * SUPER ADMIN ID
   */
  SUPER_ADMIN: string;
}

let CONF;

if (process.env.NODE_ENV === 'production') {
  CONF = process.env;
} else {
  CONF = fs.readFileSync('./config.json', 'UTF-8');
  CONF = JSON.parse(CONF);
}

export const CONFIG: IConf = CONF;
