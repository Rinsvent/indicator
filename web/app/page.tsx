'use client'

import IndicatorList from "@/components/indicator-list";
import useIndicators from "@/modules/indicator/useIndicators";
import {TIndicatorQuery} from "@/db/repository";
import IndicatorFilter from "@/components/indicator-filter";
import {useState} from "react";
import {InstallPrompt, PushNotificationManager} from "@/app/pwa";

export default function Home() {
    const [query, setQuery] = useState<TIndicatorQuery>({})
    const {data, isFetching} = useIndicators(query)

    return (
        <div style={{marginTop: '20px'}}>
            <PushNotificationManager />
            <InstallPrompt />
            <IndicatorFilter onInput={(q: TIndicatorQuery) => setQuery(q)}/>
            <IndicatorList items={data || []} />
        </div>
    );
}
