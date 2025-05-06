import * as React from 'react';
import {useState} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

type MultiSelect = {
    code: string
    choices: string[]
    onChange: (values: string[]) => void
}

export default function IndicatorMultiSelect(data: MultiSelect) {
    const [values, setValues] = useState<string[]>([])
    const handleChange = (event: SelectChangeEvent<typeof values>) => {
        const {
            target: { value },
        } = event;
        const values = typeof value === 'string' ? value.split(',') : value;
        setValues(values);
        data.onChange(values)
    };

    return (
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id={"multiple-checkbox-label"+data.code}>{data.code}</InputLabel>
            <Select
                labelId={"multiple-checkbox-label"+data.code}
                id={"multiple-checkbox" + data.code}
                multiple
                value={values}
                onChange={handleChange}
                input={<OutlinedInput label={data.code} />}
                renderValue={(selected: string[]) => selected.join(', ')}
            >
                {data.choices.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={values.includes(name)} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
