import { precacheAndRoute } from 'workbox-precaching';
import {getIndicators} from "@/sdk/indicator";
import {indicators} from "@/db/repository";
import {createIndicator, removeIndicator, updateIndicator} from "@/db/service";
import {Indicator, LevelEnum} from "@/db/models";
import ExistingDocument = PouchDB.Core.ExistingDocument;
import {notify} from "@/shared/lib/notification/manager";

declare const self: ServiceWorkerGlobalScope & {
    __ENV: { API_URL: string };
};

// precacheAndRoute(self.__WB_MANIFEST);
console.log(self.__WB_MANIFEST)
console.log(process.env)
precacheAndRoute([]);

let pushInc = 0

self.addEventListener('install', () => {
    console.log('ENV ert:', self.__ENV);
});

async function pollServer() {
    const apiIndicators = await getIndicators()
    const dbIndicators = await indicators({})
    let hasError = false

    let code2db: Record<string, ExistingDocument<Indicator>> = {}
    for (const dbIndicator of dbIndicators) {
        code2db[dbIndicator.code] = dbIndicator
    }

    let actualCodes: Record<string, boolean> = {}
    for (const apiIndicator of apiIndicators) {
        actualCodes[apiIndicator.code] = true
        if (apiIndicator.level === 'critical') {
            hasError = true
        }

        const dbIndicator = code2db[apiIndicator.code]
        const payload = {
            docType: 'indicator',
            code: apiIndicator.code,
            level: apiIndicator.level as LevelEnum,
            tags: apiIndicator.tags,
            text: apiIndicator.text,
            revisionAt: apiIndicator.revisionAt,
        } as Indicator

        if (dbIndicator) {
            await updateIndicator(payload, dbIndicator._rev)
        } else {
            await createIndicator(payload)
        }

    }

    for (const dbIndicator of dbIndicators) {
        if (typeof actualCodes[dbIndicator.code] !== 'undefined') {
            continue
        }
        // удаляем
        await removeIndicator(dbIndicator)
    }

    if (hasError && pushInc > 0) {
        await notify()
    }
    pushInc++

    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            console.log('DB_UPDATED ', client)
            client.postMessage({ type: 'DB_UPDATED' });
        });
    });

    console.log('Date ' + new Date(), indicators)

    setTimeout(pollServer, 20000);
}

self.addEventListener('activate', (event: ExtendableEvent) => {
    console.log("activate")
    event.waitUntil(pollServer());
});