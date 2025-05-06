import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {tags, TIndicatorQuery} from "@/db/repository";
import IndicatorMultiSelect from "@/components/indicator-filter/multi-select";


type IndicatorFilterType = {
    onInput: (data: TIndicatorQuery) => void
}

type Filter = {
    code: string
    choices: string[]
    values: string[]
}

export default function IndicatorFilter(data: IndicatorFilterType) {
    const [code, setCode] = useState<string>('')
    const [filters, setFilters] = useState<Filter[]>([])
    const onInput = () => {
        let tagList: string[] = []
        filters.forEach((filter) => {
            filter.values.forEach((value) => {
                tagList.push(filter.code + "#" + value)
            })
        })
        data.onInput({
            code: code,
            tags: tagList,
        })
    }

    useEffect(() => {
       tags().then((tagList: string[]) => {
           let result: Record<string, Filter> = {}
           tagList.forEach((tag) => {
               const parts = tag.split("#")
               if (parts.length === 1) {
                   return true;
               }
               const filter = result[parts[0]] || {code: parts[0], choices: [], values: []}
               if (filter.choices.indexOf(parts[1]) === -1) {
                   filter.choices.push(parts[1])
               }
               result[parts[0]] = filter
           })
           setFilters(Object.values(result))
        })
    }, []);

    useEffect(() => {
        onInput()
    }, [code])

    return (
        <Box>
            <TextField onChange={(event) => {
                setCode(event.target.value)
            }} fullWidth label="Code"/>
            {filters.map((filter, key) => {
                return (
                    <IndicatorMultiSelect key={key} {...filter} onChange={(values) => {
                        filter.values = values
                        onInput()
                    }} />
                )
            })}
        </Box>
    );
}
