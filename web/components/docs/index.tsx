import Tooltip from '@mui/material/Tooltip';
import {useState} from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from "@mui/material/IconButton";
import DocumentationPopup from "@/components/docs/popup";

export default function Documentation() {
    const [showPopup, setShowPopup] = useState(false)


    return (
        <>
            <Tooltip title={'Documentation'}>
                <IconButton onClick={() => setShowPopup(true)}>
                    <HelpOutlineIcon/>
                </IconButton>
            </Tooltip>
            <DocumentationPopup show={showPopup} handleClose={() => setShowPopup(false)}/>
        </>
    );
}
