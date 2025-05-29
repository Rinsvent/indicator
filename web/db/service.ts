import DB from "@/db/manager";
import {Indicator, Subscribe} from "@/db/models";
import {findSubscribeByTag} from "@/db/repository";
import IdMeta = PouchDB.Core.IdMeta;
import RevisionIdMeta = PouchDB.Core.RevisionIdMeta;

export const saveIndicator = async (data: Indicator) => {
    try {
        const doc = {
            "_id": "indicator_" + data.code,
            ...data,
        } as Indicator & IdMeta & RevisionIdMeta;
        const response = await DB.put(doc, {});
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
