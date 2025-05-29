import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';
import {Indicator, Subscribe} from "@/db/models";
import ExistingDocument = PouchDB.Core.ExistingDocument;

PouchDB.plugin(PouchdbFind);

const DB = new PouchDB<ExistingDocument<Indicator | Subscribe>>('indicator');

export default DB;
