import { useQuery } from '@tanstack/react-query';
import {indicators, TIndicatorQuery} from "@/db/repository";
import useDebounce from "@/shared/hooks/useDebounce";
import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";

const useIndicators = (request: TIndicatorQuery) => {
    const query = useDebounce(request)
    useIndicatorsInvalidator()

    return useQuery({
            queryKey: ['indicators', query],
            queryFn: () => indicators(query),
        }
    )
}

const useIndicatorsInvalidator = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const callback = (event: MessageEvent) => {
            if (event.data.type === 'DB_UPDATED') {
                queryClient.invalidateQueries({queryKey: ['indicators']})
            }
        }
        navigator?.serviceWorker.addEventListener('message', callback);

        return () => navigator?.serviceWorker.removeEventListener('message', callback)
    }, []);
}

export default useIndicators;
