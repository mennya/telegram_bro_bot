import * as express from 'express';
import * as bodyParser from 'body-parser';
import {CONFIG} from './src/config';
import {bot} from './src/services/bot';
import {mongo} from './src/common/db';

const app = express();
const mongoDB = mongo;

app.use(express.json());

const server = app.listen(CONFIG.PORT, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});

app.post('/bot', (req, res) => {
  console.log('Post', req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

function exitHandler(options, err) {
  bot.sendErr(`options: ${options}, err: ${JSON.stringify(err)}`);
  console.log(`options: ${options}, err: ${JSON.stringify(err)}`);
  process.exit(99);
}

process.on('uncaughtException', exitHandler.bind(null, 'uncaughtException'));
process.on('unhandledRejection', exitHandler.bind(null, 'unhandledRejection'));
process.on('exit', exitHandler.bind(null, 'exit'));
process.on('SIGINT', exitHandler.bind(null, 'SIGINT'));
process.on('SIGTERM', exitHandler.bind(null, 'SIGTERM'));
process.on('SIGBREAK', exitHandler.bind(null, 'SIGBREAK'));
process.on('SIGHUP', exitHandler.bind(null, 'SIGHUP'));
