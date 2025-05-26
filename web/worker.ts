import { precacheAndRoute } from 'workbox-precaching';

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

    console.log('Date ' + new Date())

    setTimeout(pollServer, 20000);
}

self.addEventListener('activate', (event) => {
    console.log("activate")
    console.log("NEXT_PUBLIC_ANALYTICS_ID", process.env.NEXT_PUBLIC_ANALYTICS_ID)
    event.waitUntil(pollServer());
});
