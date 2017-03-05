import * as fs from 'fs';

let CONF;

if (process.env.NODE_ENV === 'production') {
  CONF = process.env;
} else {
  CONF = fs.readFileSync('./config.json', 'UTF-8');
  CONF = JSON.parse(CONF);
}

export const CONFIG = CONF;
