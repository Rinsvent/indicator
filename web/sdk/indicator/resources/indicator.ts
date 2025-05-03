import API from '../client';

import type {
    TIndicators,
} from '../types/DTO';
import type { TAxiosRequestConfig } from '../types/TRequestConfig';

export const getIndicators = async (config?: TAxiosRequestConfig) =>
    (await API.get<TIndicators>('indicators', { ...config })).data;
