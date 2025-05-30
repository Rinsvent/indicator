import Chip from '@mui/material/Chip';
import {unsubscribe} from "@/db/service";
import {useQueryClient} from "@tanstack/react-query";

type SubscribesTagType = {
    tag: string
}

export default function SubscribesTag({tag}: SubscribesTagType) {
    const queryClient = useQueryClient()
    return (
        <Chip
            style={{marginRight: '10px'}} key={tag} label={tag} clickable={true}
            onDelete={async () => {
                await unsubscribe(tag)
                await queryClient.invalidateQueries({queryKey: ['subscribeTags']})
            }}
        />
    );
}
