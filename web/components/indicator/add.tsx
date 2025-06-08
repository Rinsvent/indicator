import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import Tooltip from '@mui/material/Tooltip';
import IndicatorPopup from "@/components/indicator/popup";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";

export default function AddIndicator() {
    const [showPopup, setShowPopup] = useState(false)

    return (
        <>
            <Tooltip title={`Add indicator`}>
                <IconButton onClick={() => setShowPopup(true)}>
                    <NotificationAddIcon />
                </IconButton>
            </Tooltip>
            <IndicatorPopup readonly={false} show={showPopup} handleClose={() => setShowPopup(false)}/>
        </>
    );
}
