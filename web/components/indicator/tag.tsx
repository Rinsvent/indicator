import Chip from '@mui/material/Chip';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {subscribe, unsubscribe} from "@/db/service";
import {useQueryClient} from "@tanstack/react-query";

type IndicatorTagType = {
    tag: string
    isSubscribed: boolean
}

export default function IndicatorTag({tag, isSubscribed}: IndicatorTagType) {
    const queryClient = useQueryClient()
    return (
        <Chip
            icon={isSubscribed ? <NotificationsActiveIcon/> : <NotificationsOffIcon/>}
            style={{marginRight: '10px'}} key={tag} label={tag} clickable={true}
            onClick={async () => {
                if (isSubscribed) {
                    await unsubscribe(tag)
                } else {
                    await subscribe(tag)
                }
                await queryClient.invalidateQueries({queryKey: ['subscribeTags']})
            }}
        />
    );
}
