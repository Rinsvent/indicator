'use client'

import { useEffect } from 'react'
import { Workbox } from 'workbox-window'

export function PWA() {
    useEffect(() => {
        const wb = new Workbox("sw.js", {scope: "/"})
        wb.register()
    }, [])
    return <></>
}