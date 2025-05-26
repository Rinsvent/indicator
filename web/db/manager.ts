import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';
import {Indicator} from "@/db/models";

PouchDB.plugin(PouchdbFind);

const DB = new PouchDB<Indicator>('indicator');

export default DB;
