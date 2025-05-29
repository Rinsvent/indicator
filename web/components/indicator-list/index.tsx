import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import {Indicator as IndicatorDB, LevelEnum} from "@/db/models";
import Indicator from "@/components/indicator";

type IndicatorListType = {
    items: IndicatorDB[]
}

const level2Sort = (level: LevelEnum) => {
     switch(level) {
        case LevelEnum.Critical: return 1;
        case LevelEnum.Error: return 2;
        case LevelEnum.Warning: return 3;
        case LevelEnum.Success: return 4;
    }
}

export default function IndicatorList(data: IndicatorListType) {
    const [indicators, setIndicators] = useState<IndicatorDB[]>([])

    useEffect(() => {
        const items = data.items.sort((a, b) => {
            const a1 = level2Sort(a.level)
            const b1 = level2Sort(b.level)

            if (a1 === b1) {
                return 0
            }

            if (a1 < b1) {
                return -1
            }

            return 1
        })
        setIndicators(items)
    }, [data.items])


    return (
        <Box>
            {indicators.map((indicator, key) => {
                return (
                    <Indicator key={key} indicator={indicator} />
                )
            })}
        </Box>
    );
}
