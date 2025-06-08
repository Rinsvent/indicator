import Tooltip from '@mui/material/Tooltip';
import {useState} from "react";
import Badge from '@mui/material/Badge';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import IconButton from "@mui/material/IconButton";
import SubscribesPopup from "@/components/subscribes/popup";
import useSubscribeTags from "@/modules/indicator/useSubscribes";

export default function Subscribes() {
    const [showPopup, setShowPopup] = useState(false)
    const {data} = useSubscribeTags()

    return (
        <>
            <Tooltip title={'Subscribes list'}>
                <IconButton onClick={() => Object.keys(data || {}).length > 0 && setShowPopup(true)}>
                    <Badge badgeContent={Object.keys(data || {}).length} color="secondary">
                        <EditNotificationsIcon/>
                    </Badge>
                </IconButton>
            </Tooltip>
            <SubscribesPopup show={showPopup} tags={Object.keys(data || {})} handleClose={() => setShowPopup(false)}/>
        </>
    );
}
