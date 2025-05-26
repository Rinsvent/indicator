'use client'

import { useState, useEffect } from 'react'
import { Workbox } from 'workbox-window'
//
// async function requestNotificationPermission() {
//     const permission = await Notification.requestPermission();
//     if (permission !== 'granted') {
//         console.error('Разрешение не получено!');
//         return false;
//     }
//     return true;
// }

// async function registerPeriodicNewsCheck() {
//     const registration = await navigator.serviceWorker.ready;
//     try {
//         await registration.periodicSync.register("check", {
//             minInterval: 60 * 1000,
//         });
//         console.log("Periodic Sync is registered!");
//     } catch {
//         console.log("Periodic Sync could not be registered!");
//     }
// }

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        const wb = new Workbox("sw.js", {scope: "/"})
        wb.register()
        // const registration = await navigator.serviceWorker.register('/sw.js', {
        //     // scope: '/',
        //     // updateViaCache: 'none',
        //     type: 'module',
        // })

        // // @ts-expect-error while so
        // await registration.sync.register("sync-indicators");
        //
        // // @ts-expect-error while so
        // await registration.periodicSync.register("check", {
        //     minInterval: 5 * 1000,
        // });
        // await requestNotificationPermission()
        //
        // const status = await navigator.permissions.query({
        //     name: 'periodic-background-sync',
        // });
        // if (status.state === 'granted') {
        //     console.log('granted periodic')
        // } else {
        //     console.log('not granted periodic')
        // }
        // // await registerPeriodicNewsCheck()
        //
        // console.log(navigator.serviceWorker.controller)
        // navigator.serviceWorker.controller?.postMessage({
        //     type: 'FORCE_SYNC'
        // });
    }

    // async function registerServiceWorker2() {
    //     if (!('serviceWorker' in navigator)) return false;
    //
    //     const reg = await navigator.serviceWorker.register('sw.js', {
    //         scope: '/',
    //         updateViaCache: 'none',
    //         type: 'module',
    //     });
    //     console.log('Service Worker зарегистрирован');
    //     return reg;
    // }


    // async function subscribeToPush() {
    //     const registration = await navigator.serviceWorker.ready
    //     const sub = await registration.pushManager.subscribe({
    //         userVisibleOnly: true,
    //         applicationServerKey: urlBase64ToUint8Array(
    //             process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    //         ),
    //     })
    //     setSubscription(sub)
    //     const serializedSub = JSON.parse(JSON.stringify(sub))
    //     await subscribeUser(serializedSub)
    // }
    //
    // async function unsubscribeFromPush() {
    //     await subscription?.unsubscribe()
    //     setSubscription(null)
    //     await unsubscribeUser()
    // }
    //
    // async function sendTestNotification() {
    //
    //
    //     if (subscription) {
    //         // await sendNotification(message)
    //
    //         setMessage('')
    //     }
    // }

    // async function sendPushNotification() {
    //     const permission = await requestNotificationPermission();
    //     if (!permission) return;
    //
    //     // const reg = await registerServiceWorker2();
    //     console.log(reg, 'dddddd')
    //     if (!reg) return;
    //
    //     console.log(reg, '444444')
    //     // Отправляем уведомление через Service Worker
    //     reg.active.postMessage({
    //         title: 'Тест',
    //         body: 'Это push-уведомление без сервера!',
    //     });
    // }

    if (!isSupported) {
        return <p>Push notifications are not supported in this browser.</p>
    }

    return (
        <div>
            <h3>Push Notifications</h3>
            {/*{subscription ? (*/}
                <>
                    <p>You are subscribed to push notifications.</p>
                    {/*<button onClick={unsubscribeFromPush}>Unsubscribe</button>*/}
                    <input
                        type="text"
                        placeholder="Enter notification message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    {/*<button onClick={sendPushNotification}>Send Test</button>*/}
                </>
            {/*) : (*/}
            {/*    <>*/}
            {/*        <p>You are not subscribed to push notifications.</p>*/}
            {/*        /!*<button onClick={subscribeToPush}>Subscribe</button>*!/*/}
            {/*    </>*/}
            {/*)}*/}
        </div>
    )
}

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {

        setIsIOS(
            // @ts-expect-error while so
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window?.MSStream
        )

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])

    if (isStandalone) {
        return null // Don't show install button if already installed
    }

    return (
        <div>
            <h3>Install App</h3>
            <button>Add to Home Screen</button>
            {isIOS && (
                <p>
                    To install this app on your iOS device, tap the share button
                    <span role="img" aria-label="share icon">
            {' '}
                        ⎋{' '}
          </span>
                    and then &quot;Add to Home Screen&quot;
                    <span role="img" aria-label="plus icon">
            {' '}
                        ➕{' '}
          </span>.
                </p>
            )}
        </div>
    )
}
