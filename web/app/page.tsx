'use client'

import {PWA} from "@/components/pwa";
import dynamic from 'next/dynamic';

export default function Home() {
    // const PwaUpdater = dynamic(() => import(`./PwaUpdater`), { ssr: false });

    const IndicatorPage = dynamic(
        () => import('@/components/indicator-page'),
        { ssr: false }
    );

    return (
        <>
            <PWA />
            <IndicatorPage/>
        </>
    );
}
