'use client'

import { useEffect } from 'react'
import { Workbox } from 'workbox-window'

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.error('Разрешение не получено!');
        return false;
    }
    return true;
}

export function PWA() {
    useEffect(() => {
        const wb = new Workbox("sw.js", {scope: "/"})
        wb.register()
            .then(() => {
                return requestNotificationPermission()
            })

    }, [])
    return <></>
}