import Tooltip from '@mui/material/Tooltip';
import {useState} from "react";
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import IconButton from "@mui/material/IconButton";
import SubscribesPopup from "@/components/subscribes/popup";

export default function Subscribes() {
    const [showPopup, setShowPopup] = useState(false)


    return (
        <>
            <Tooltip title={'Subscribes list'}>
                <IconButton onClick={() => setShowPopup(true)}>
                    <EditNotificationsIcon/>
                </IconButton>
            </Tooltip>
            <SubscribesPopup show={showPopup} handleClose={() => setShowPopup(false)}/>
        </>
    );
}
