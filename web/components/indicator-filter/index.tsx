import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {tags, TIndicatorQuery} from "@/db/repository";
import IndicatorMultiSelect from "@/components/indicator-filter/multi-select";
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Paper from '@mui/material/Paper';

type IndicatorFilterType = {
    onInput: (data: TIndicatorQuery) => void
}

type Filter = {
    code: string
    choices: string[]
    values: string[]
}

export default function IndicatorFilter(data: IndicatorFilterType) {
    const [expand, setExpand] = useState<boolean>(false)
    const [code, setCode] = useState<string>('')
    const [filters, setFilters] = useState<Filter[]>([])
    const onInput = () => {
        const tagList: string[] = []
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
           const result: Record<string, Filter> = {}
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
        <Box style={{marginTop: "20px", marginBottom: "20px"}}>
            <Paper
                style={{backgroundColor: 'var(--background)'}}
                component="div"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
            >
                <IconButton type="button" sx={{ p: '10px', marginRight: '2px' }} aria-label={expand ? 'Hide filters' : 'Show filters'}>
                    {!expand && <ExpandMoreIcon onClick={() => setExpand(true)} />}
                    {expand && <ExpandLessIcon onClick={() => setExpand(false)} />}
                </IconButton>
                <TextField onChange={(event) => {
                    setCode(event.target.value)
                }} fullWidth label="Code"/>
            </Paper>
            {expand && filters.map((filter, key) => {
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
