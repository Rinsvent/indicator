import Brightness1Icon from '@mui/icons-material/Brightness1';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import IndicatorPopup from "@/components/indicator/popup";
import {Indicator as IndicatorDB} from "@/db/models";
import {useState} from "react";

type IndicatorType = {
    indicator: IndicatorDB
}

export default function Indicator(data: IndicatorType) {
    const [showPopup, setShowPopup] = useState(false)
    const color = (level: string) => {
        switch (level) {
            case "success":
                return 'green'
            case "warning":
                return 'yellow'
            case "error":
            case "critical":
                return 'red'
            default:
                return 'gray'
        }
    }

    return (
        <>
            <Tooltip title={data.indicator.text}>
                <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                      icon={<Brightness1Icon style={{color: color(data.indicator.level)}}/>}
                      label={data.indicator.code}
                      onClick={() => setShowPopup(true)}
                      clickable={true}
                />
            </Tooltip>
            <IndicatorPopup indicator={data.indicator} show={showPopup} handleClose={() => setShowPopup(false)}/>
        </>
    );
}
