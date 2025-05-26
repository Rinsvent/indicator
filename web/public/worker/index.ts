// // import {getIndicators} from "../sdk/indicator";
//
// // @ts-ignore
// declare let self: ServiceWorkerGlobalScope
//
// // self.addEventListener('push', function (event) {
// //     if (event.data) {
// //         const data = event.data.json()
// //         const options = {
// //             body: data.body,
// //             icon: data.icon || '/icon.png',
// //             badge: '/badge.png',
// //             vibrate: [100, 50, 100],
// //             data: {
// //                 dateOfArrival: Date.now(),
// //                 primaryKey: '2',
// //             },
// //         }
// //         event.waitUntil(self.registration.showNotification(data.title, options))
// //     }
// // })
//
// async function pollServer() {
//     // const response = await fetch('/api/updates');
//     // const data = await response.json();
//     // console.log('Данные:', data);
//     // self.registration.showNotification('asdf', {
//     //     body: 'Date ' + new Date(),
//     //     icon: 'icon.png',
//     // })
//
//     console.log('Date ' + new Date())
//
//     setTimeout(pollServer, 5000); // Опрос каждые 5 секунд
// }
//
// self.addEventListener('activate', (event) => {
//     // @ts-ignore
//     event.waitUntil(pollServer());
// });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// // // import {getIndicators} from "../sdk/indicator";
// //
// // // self.addEventListener('push', function (event) {
// // //     if (event.data) {
// // //         const data = event.data.json()
// // //         const options = {
// // //             body: data.body,
// // //             icon: data.icon || '/icon.png',
// // //             badge: '/badge.png',
// // //             vibrate: [100, 50, 100],
// // //             data: {
// // //                 dateOfArrival: Date.now(),
// // //                 primaryKey: '2',
// // //             },
// // //         }
// // //         event.waitUntil(self.registration.showNotification(data.title, options))
// // //     }
// // // })
// //
// // async function pollServer() {
// //     // const response = await fetch('/api/updates');
// //     // const data = await response.json();
// //     // console.log('Данные:', data);
// //     // self.registration.showNotification('asdf', {
// //     //     body: 'Date ' + new Date(),
// //     //     icon: 'icon.png',
// //     // })
// //
// //     console.log('Date ' + new Date())
// //
// //     setTimeout(pollServer, 5000); // Опрос каждые 5 секунд
// // }
// //
// // self.addEventListener('activate', (event) => {
// //     event.waitUntil(pollServer());
// // });
// //
// // self.addEventListener('push', (event) => {
// //     const data = { title: 'Уведомление!', body: 'Привет, мир!' };
// //
// //     event.waitUntil(
// //         self.registration.showNotification(data.title, {
// //             body: data.body,
// //             icon: 'icon.png',
// //         })
// //     );
// // });
// //
// // self.addEventListener('notificationclick', function (event) {
// //     console.log('Notification click received.')
// //     event.notification.close()
// //     event.waitUntil(clients.openWindow('https://bp.rinsvent.ru'))
// // })
// //
// // self.addEventListener("sync", (event) => {
// //     if (event.tag === "sync-indicators") {
// //         event.waitUntil(() => {
// //             console.log('sync')
// //         });
// //     }
// // });
// // self.addEventListener('message', async event => {
// //     console.log('FORCE_SYNC start')
// //     if (event.data.type === 'FORCE_SYNC') {
// //         // Выполнить синхронизацию
// //         console.log('FORCE_SYNC')
// //
// //         // const data = event.data?.json() || { title: 'Уведомление!', body: 'Привет, мир!' };
// //         const data = { title: 'Уведомление!', body: 'Привет, мир!' };
// //
// //         event.waitUntil(
// //             self.registration.showNotification(data.title, {
// //                 body: data.body,
// //                 icon: 'icon.png',
// //             })
// //         );
// //
// //         // const indicators = await getIndicators()
// //         // console.log(indicators)
// //     }
// // });
// //
// // self.addEventListener("periodicsync", (event) => {
// //     console.log(event, 'periodicsync')
// //     if (event.tag === "check") {
// //         const data = { title: 'Уведомление!', body: 'Привет, мир!' };
// //         event.waitUntil(
// //             self.registration.showNotification(data.title, {
// //                 body: data.body,
// //                 icon: 'icon.png',
// //             })
// //         );
// //     }
// // });