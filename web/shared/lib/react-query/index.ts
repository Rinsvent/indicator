import { QueryClient } from '@tanstack/react-query';

const config = {
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 60_000 * 3,
      staleTime: 60_000 * 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
};

const client = new QueryClient(config);

export { config, client };
