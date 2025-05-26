import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Доступ к переменным окружения через глобальную переменную
declare const self: ServiceWorkerGlobalScope & {
    __ENV: Record<string, string>;
};

// Активация сервис-воркера сразу
clientsClaim();

// Прекеширование ресурсов из манифеста
precacheAndRoute((self as any).__WB_MANIFEST);

// Пример стратегии кэширования с использованием переменных окружения
const API_CACHE_NAME = self.__ENV.API_CACHE_NAME || 'api-cache';

registerRoute(
    ({ url }) => url.pathname.startsWith('/api'),
    new StaleWhileRevalidate({
        cacheName: API_CACHE_NAME,
        plugins: [new ExpirationPlugin({ maxEntries: 50 })],
    })
);

// Кэширование изображений
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 2592000 })],
    })
);

// Обработка установки
self.addEventListener('install', (event) => {
    console.log('Service Worker installed with env:', self.__ENV);
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
    // @ts-ignore
    event.waitUntil(pollServer());
});
