'use client'

import dynamic from 'next/dynamic';

export default function Home() {
    const IndicatorPage = dynamic(
        () => import('@/components/indicator-page'),
        { ssr: false }
    );

    return (
        <IndicatorPage/>
    );
}
