import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import {Indicator} from "@/db/models";
import IndicatorTag from "@/components/indicator/tag";
import useSubscribeTags from "@/modules/indicator/useSubscribes";
import {useState} from "react";
import TextField from "@mui/material/TextField";
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import IconButton from "@mui/material/IconButton";
import OutlinedInput from '@mui/material/OutlinedInput';
import {Autocomplete, Divider, InputAdornment} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {deleteIndicator, upsertIndicator} from "@/sdk/indicator";

type IndicatorPopupType = {
    indicator?: Indicator
    readonly: boolean
    show: boolean
    handleClose: () => void
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function IndicatorPopup({show, handleClose, indicator, readonly}: IndicatorPopupType) {
    const {data} = useSubscribeTags()
    const [code, setCode] = useState(indicator?.code || "")
    const [text, setText] = useState(indicator?.text || "")
    const [tags, setTags] = useState<string[]>(indicator?.tags || [])

    const canSave = () => {
        return code && (!indicator || text != indicator.text || tags.sort().join('/') != indicator.tags.sort().join('/'))
    }

    return (
        <Modal
            open={show}
            onClose={() => {
                handleClose()
                if (!indicator) {
                    setCode("")
                    setText("")
                    setTags([])
                }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <FormControl fullWidth={true} variant="outlined">
                    <InputLabel htmlFor={`outlined-adornment-password${code}`}>Code</InputLabel>
                    <OutlinedInput
                        id={`outlined-adornment-password${code}`}
                        onChange={(event) => {
                            setCode(event.target.value)
                        }}
                        fullWidth={true}
                        value={code}
                        label="Code"
                        slotProps={{
                            input: {
                                readOnly: readonly || !!indicator,
                            },
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                {canSave() && <IconButton
                                    onClick={async () => {
                                        await upsertIndicator(code, {
                                            tags: tags,
                                            text: text,
                                        })
                                    }}
                                >
                                    <SaveAsOutlinedIcon/>
                                </IconButton>}
                                {indicator && <IconButton
                                    // aria-label={
                                    //     showPassword ? 'hide the password' : 'display the password'
                                    // }
                                    onClick={async () => await deleteIndicator(code)}
                                    // onMouseDown={handleMouseDownPassword}
                                    // onMouseUp={handleMouseUpPassword}
                                >
                                    <DeleteForeverOutlinedIcon/>
                                </IconButton>}
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <div
                    style={{
                        marginTop: '10px'
                    }}
                >
                    Level: {indicator?.level || 'N/A'}
                </div>
                <TextField
                    style={{
                        marginTop: '10px'
                    }}
                    onChange={(event) => {
                        setText(event.target.value)
                    }}
                    fullWidth={true}
                    value={text}
                    label="Text"
                    variant="outlined"
                    slotProps={{
                        input: {
                            readOnly: readonly,
                        },
                    }}
                />

                <Autocomplete
                    style={{
                        marginTop: '10px'
                    }}
                    onChange={(event, value) => setTags(value as string[])}
                    multiple
                    freeSolo
                    options={Object.keys(data || {})}
                    getOptionLabel={(option) => option}
                    value={tags}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tags"
                            placeholder="Tags"
                        />
                    )}
                />

                <div
                    style={{
                        marginTop: '10px'
                    }}
                >
                    Revision date: {indicator?.revisionAt ? indicator.revisionAt : 'N/A'}
                </div>

                <Divider style={{marginTop: '10px'}}/>

                <div
                    style={{
                        marginTop: '10px'
                    }}
                >
                    {tags.map((tag) => {
                        return <IndicatorTag key={tag} tag={tag}
                                             isSubscribed={data !== undefined && typeof data[tag] !== 'undefined'}/>
                    })}
                </div>
            </Box>
        </Modal>
    );
}
