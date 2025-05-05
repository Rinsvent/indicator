import DB from "@/db/manager";
import {Indicator} from "@/db/models";

export const saveIndicator = async (data: Indicator) => {
    try {
        const doc = {
            "_id": "indicator_" + data.code,
            "docType": "indicator",
            ...data
        };
        const response = await DB.put(doc, {});
        console.log('!!!!!!!!!!!!!!!!!!!!!!', response)
    } catch (e) {
        console.log(e)
    }
}
