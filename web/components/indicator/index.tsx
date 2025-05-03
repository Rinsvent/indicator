import Brightness1Icon from '@mui/icons-material/Brightness1';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

type IndicatorType = {
    code: string
    level: string
    text: string
}

export default function Indicator(data: IndicatorType) {
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
        <Tooltip title={data.text}>
            <IconButton>
                <Chip icon={<Brightness1Icon style={{color: color(data.level)}}/>} label={data.code} />
            </IconButton>
        </Tooltip>
    );
}
