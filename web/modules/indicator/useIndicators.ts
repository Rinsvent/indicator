import { useQuery } from '@tanstack/react-query';
import {indicators, TIndicatorQuery} from "@/db/repository";
import useDebounce from "@/shared/hooks/useDebounce";

const useIndicators = (request: TIndicatorQuery) => {
    const query = useDebounce(request)
    console.log('query', query)
    return useQuery({
            queryKey: ['indicators', query],
            queryFn: () => indicators(query),
        }
    )
}
export default useIndicators;
