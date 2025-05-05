import DB from "@/db/manager";
import {saveIndicator} from "@/db/service";
import {Indicator, LevelEnum} from "@/db/models";

export type TIndicatorQuery = {
    code?: string
    levels?: LevelEnum[]
    tags?: string[]
}

export const indicators = async (request: TIndicatorQuery) => {
    // const doc = {
    //     "code": "tests",
    //     "level": "warning",
    //     "text": 'It`s fail',
    //     "tags": [
    //         "third",
    //         "second",
    //     ],
    //     "revisionAt": new Date(),
    // } as Indicator;
    // await saveIndicator(doc)

    let query: any = {}
    if (request.code) {
        query['code'] = {$regex: request.code}
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

// export const addChat = async (data: any) =>
//     (await DB.put(data));