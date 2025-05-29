import { useQuery } from '@tanstack/react-query';
import { subscribeTags} from "@/db/repository";

const useSubscribeTags = () => {
    return useQuery({
            queryKey: ['subscribeTags'],
            queryFn: () => subscribeTags(),
        }
    )
}
export default useSubscribeTags;
