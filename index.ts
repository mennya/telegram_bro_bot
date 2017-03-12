import * as express from 'express';
import * as bodyParser from 'body-parser';
import {CONFIG} from './src/config';
import {broBot} from './src/services/bot';
import {mongo} from './src/common/db';

const app = express();
const mongoDB = mongo;

app.use(bodyParser.json());

const server = app.listen(CONFIG.PORT, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});

app.post('/bot', (req, res) => {
  broBot.processUpdate(req.body);
  res.sendStatus(200);
});
