import DB from "@/db/manager";
// import {saveIndicator} from "@/db/service";
import {Indicator, LevelEnum, Subscribe} from "@/db/models";
import ExistingDocument = PouchDB.Core.ExistingDocument;

export type TIndicatorQuery = {
    code?: string
    levels?: LevelEnum[]
    tags?: string[]
}

export const indicators = async (request: TIndicatorQuery) => {
    // const doc = {
    //     "code": "dj",
    //     "level": "critical",
    //     "text": 'Panic',
    //     "tags": [
    //         "env#qa",
    //         "G#aml",
    //         "G#admin-panel",
    //     ],
    //     "revisionAt": new Date(),
    // } as Indicator;
    // await saveIndicator(doc)
    // return []
    let query: any = {}
    if (request.code) {
        query['code'] = {$regex: request.code}
    }
    if (request.tags?.length && request.tags.length > 0) {
        query['tags'] = {$in: request.tags}
    }

    let data = null
    try {
        data = await DB.find({
            selector: {
                'docType': "indicator",
                 ...query,
            },
        })
        console.log('sdfaddddddddddddd', query, data)
    }catch (e) {
        console.log('22222222222222222222', e)
    }

    return (data?.docs || []) as Indicator[]
    // return (await DB.allDocs({include_docs: true}));
}

export const tags = async (): Promise<string[]> => {
    if (typeof window === 'undefined') {
        return []
    }
    let tags: string[] = []
    try {

        // @ts-ignore
        const data = await DB.query((doc, emit) => {
            if (doc.docType === 'indicator' && doc.tags && Array.isArray(doc.tags)) {
                doc.tags.forEach(function(tag) {
                    // @ts-ignore
                    emit(tag);
                });
            }
        }, {
            group: true,
            reduce: function(keys, values, rereduce) {
                // Просто возвращаем массив уникальных ключей
                if (rereduce) {
                    // @ts-ignore
                    return [].concat.apply([], values).filter(function(v, i, a) {
                        return a.indexOf(v) === i;
                    });
                } else {
                    // @ts-ignore
                    return keys.map(function(k) { return k.key; }).filter(function(v, i, a) {
                        return a.indexOf(v) === i;
                    });
                }
            }
        })
        const onlyUnique = (value: string, index: number, array: string[]) => array.indexOf(value) === index
        // @ts-ignore
        tags = data.rows.map((row) => row.key).filter(onlyUnique);
    }catch (e) {
        console.log('333333333333333333333', e)
    }

    return tags
}

export const subscribes = async () => {

    let data = null
    try {
        data = await DB.find({
            selector: {
                'docType': "subscribe",
            },
        })
    }catch (e) {
        console.log('22222222222222222222', e)
    }

    return (data?.docs || []) as Subscribe[]
}

export const subscribeTags = async () => {
    let tags: Record<string, string> = {}
    try {
        const data = await DB.find({
            selector: {
                'docType': "subscribe",
            },
        })
        const docs = (data?.docs || []) as Subscribe[]
        docs.forEach((subscribe: Subscribe) => {
            tags[subscribe.tag] = subscribe.tag
        })
    }catch (e) {
        console.log('22222222222222222222', e)
    }

    return tags
}

export const findSubscribeByTag = async (tag: string) => {

    let data = null
    try {
        data = await DB.find({
            selector: {
                'docType': "subscribe",
                'tag': tag,
            },
            limit: 1,
        })
    }catch (e) {
        console.log('22222222222222222222', e)
    }

    if (data?.docs.length === 0) {
        return null
    }

    return data?.docs[0] as ExistingDocument<Subscribe>
}
