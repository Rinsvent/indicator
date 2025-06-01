import Brightness1Icon from '@mui/icons-material/Brightness1';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import IndicatorPopup from "@/components/indicator/popup";
import {Indicator as IndicatorDB, LevelEnum} from "@/db/models";
import {useEffect, useState} from "react";

type IndicatorType = {
    indicator: IndicatorDB
}

export default function Indicator(data: IndicatorType) {
    const [showPopup, setShowPopup] = useState(false)
    const [hasIcon, setHasIcon] = useState(true)
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

    useEffect(() => {
        let timerId = null
        if (data.indicator.level === LevelEnum.Critical) {
            timerId = setInterval(() => {
                setHasIcon(!hasIcon)
            }, 1000)
        }

        return () => {
            if (timerId) {
                clearInterval(timerId)
            }
        }
    }, [hasIcon, data.indicator.level]);

    return (
        <>
            <Tooltip title={data.indicator.text}>
                <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                      icon={hasIcon
                          ? <Brightness1Icon style={{color: color(data.indicator.level)}}/>
                          : <Brightness1Icon style={{color: 'rgba(0, 0, 0, 0.08)'}}/>}
                      label={data.indicator.code}
                      onClick={() => setShowPopup(true)}
                      clickable={true}
                />
            </Tooltip>
            <IndicatorPopup indicator={data.indicator} show={showPopup} handleClose={() => setShowPopup(false)}/>
        </>
    );
}
