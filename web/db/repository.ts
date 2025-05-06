import DB from "@/db/manager";
import {saveIndicator} from "@/db/service";
import {Indicator, LevelEnum} from "@/db/models";

export type TIndicatorQuery = {
    code?: string
    levels?: LevelEnum[]
    tags?: string[]
}

export const indicators = async (request: TIndicatorQuery) => {
    const doc = {
        "code": "dj",
        "level": "critical",
        "text": 'Panic',
        "tags": [
            "env#qa",
            "G#aml",
            "G#admin-panel",
        ],
        "revisionAt": new Date(),
    } as Indicator;
    await saveIndicator(doc)

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

    return data?.docs || []
    // return (await DB.allDocs({include_docs: true}));
}

export const tags = async (): Promise<string[]> => {
    let tags: string[] = []
    try {
        const data = await DB.query((doc, emit) => {
            if (doc.tags && Array.isArray(doc.tags)) {
                doc.tags.forEach(function(tag) {
                    emit(tag);
                });
            }
        }, {
            group: true,
            reduce: function(keys, values, rereduce) {
                // Просто возвращаем массив уникальных ключей
                if (rereduce) {
                    return [].concat.apply([], values).filter(function(v, i, a) {
                        return a.indexOf(v) === i;
                    });
                } else {
                    return keys.map(function(k) { return k.key; }).filter(function(v, i, a) {
                        return a.indexOf(v) === i;
                    });
                }
            }
        })
        const onlyUnique = (value: string, index: number, array: string[]) => array.indexOf(value) === index
        tags = data.rows.map((row) => row.key).filter(onlyUnique);
    }catch (e) {
        console.log('333333333333333333333', e)
    }

    return tags
}