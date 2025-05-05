import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {TIndicatorQuery} from "@/db/repository";

type IndicatorFilterType = {
    onInput: (data: TIndicatorQuery) => void
}

export default function IndicatorFilter(data: IndicatorFilterType) {
    const [code, setCode] = useState<string>('')
    const onInput = () => {
        data.onInput({
            code: code
        })
    }

    useEffect(() => {
        onInput()
    }, [code])

    return (
        <Box>
            <TextField onChange={(event) => {
                setCode(event.target.value)
            }} fullWidth label="Code"/>
        </Box>
    );
}
