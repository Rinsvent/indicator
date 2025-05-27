import { precacheAndRoute } from 'workbox-precaching';
import {getIndicators} from "@/sdk/indicator";
import {saveIndicator} from "@/db/service";
import {LevelEnum} from "@/db/models";

declare const self: ServiceWorkerGlobalScope & {
    __ENV: { API_URL: string };
};

// precacheAndRoute(self.__WB_MANIFEST);
console.log(self.__WB_MANIFEST)
console.log(process.env)
precacheAndRoute([]);

self.addEventListener('install', () => {
    console.log('ENV ert:', self.__ENV);
});

async function pollServer() {
    // const response = await fetch('/api/updates');
    // const data = await response.json();
    // console.log('Данные:', data);
    // self.registration.showNotification('asdf', {
    //     body: 'Date ' + new Date(),
    //     icon: 'icon.png',
    // })
    const indicators = await getIndicators()

    let hasError = false
    for (const indicator of indicators) {
        saveIndicator({
            code: indicator.code,
            level: indicator.level as LevelEnum,
            tags: indicator.tags,
            text: indicator.text,
            revisionAt: new Date(indicator.revisionAt),
        })
        if (indicator.level === LevelEnum.Critical) {
            self.registration.showNotification(indicator.code, {
                body: 'Critical error ' + new Date(),
                icon: 'icon.png',
            })
        }
    }

    console.log('Date ' + new Date(), indicators)

    setTimeout(pollServer, 20000);
}

self.addEventListener('activate', (event) => {
    console.log("activate")
    console.log("NEXT_PUBLIC_ANALYTICS_ID", process.env.NEXT_PUBLIC_ANALYTICS_ID)
    event.waitUntil(pollServer());
});
