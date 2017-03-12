import {CONFIG} from '../config';
import {connection, connect} from 'mongoose';

class Mongo {
  public db;

  constructor() {
    connection.on('error', errHandler);
    connect(CONFIG.MONGOLAB_URI);

    this.db = connection;
    this.db.on('error', errHandler);

    this.db.once('open', () => console.log('mongodb opened'));
  }
}

function errHandler(error) {
  console.log(error);
}

export const mongo = new Mongo();
