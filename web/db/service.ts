import DB from "@/db/manager";
import {Indicator, Subscribe} from "@/db/models";
import {findSubscribeByTag, indicator} from "@/db/repository";
import IdMeta = PouchDB.Core.IdMeta;
import RevisionIdMeta = PouchDB.Core.RevisionIdMeta;
import ExistingDocument = PouchDB.Core.ExistingDocument;

export const createIndicator = async (data: Indicator) => {
    try {
        const id  = "indicator_" + data.code

        const doc = {
            "_id": id,
            ...data,
        } as Indicator & IdMeta & RevisionIdMeta;
        const response = await DB.post(doc, {});
        console.log('!!!!!!!!!!!!!!!!!!!!!!', response)
    } catch (e) {
        console.log(e)
    }
}

export const updateIndicator = async (data: Indicator, revision: string = "") => {
    try {
        const id  = "indicator_" + data.code

        const doc = {
            "_id": id,
            "_rev": revision,
            ...data,
        } as Indicator & IdMeta & RevisionIdMeta;
        const response = await DB.put(doc, {});
        console.log('!!!!!!!!!!!!!!!!!!!!!!', response)
    } catch (e) {
        console.log(e)
    }
}

export const removeIndicator = async (indicator: ExistingDocument<Indicator>) => {
    try {
        const response = await DB.remove(indicator);
        console.log('!!!!!!!!!!!!!!!!!!!!!!', response)
    } catch (e) {
        console.log(e)
    }
}

export const subscribe = async (tag: string) => {
    try {
        const model = await findSubscribeByTag(tag)
        if (model !== null) {
            return
        }
        const doc = {
            _id: 'subscribe_' + tag,
            docType: 'subscribe',
            tag: tag,
            createdAt: (new Date()).toUTCString(),
        } as Subscribe & IdMeta & RevisionIdMeta
        const response = await DB.put(doc, {});
        console.log('!!!!!!!!!!!!!!!!!!!!!!', response)
    } catch (e) {
        console.log(e)
    }
}

export const unsubscribe = async (tag: string) => {
    try {
        const model = await findSubscribeByTag(tag)
        if (model === null) {
            return
        }
        const response = await DB.remove(model);
        console.log('!!!!!!!!!!!!!!!!!!!!!!', response)
    } catch (e) {
        console.log(e)
    }
}
