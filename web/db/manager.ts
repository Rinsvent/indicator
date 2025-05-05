import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';

PouchDB.plugin(PouchdbFind);

const DB = new PouchDB('indicator');

export default DB;
