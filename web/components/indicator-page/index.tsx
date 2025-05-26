'use client'

import IndicatorList from "@/components/indicator-list";
import useIndicators from "@/modules/indicator/useIndicators";
import {TIndicatorQuery} from "@/db/repository";
import IndicatorFilter from "@/components/indicator-filter";
import {useState} from "react";

export default function IndicatorPage() {
    const [query, setQuery] = useState<TIndicatorQuery>({})
    const {data} = useIndicators(query)

    return (
        <>
            <IndicatorFilter onInput={(q: TIndicatorQuery) => setQuery(q)}/>
            <IndicatorList items={data || []} />
        </>
    );
}
