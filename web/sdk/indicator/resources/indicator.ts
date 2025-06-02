import API from '../client';

import type {
    TIndicators,
} from '../types/DTO';
import type { TAxiosRequestConfig } from '../types/TRequestConfig';
import {AxiosResponse} from "axios";

export const getIndicators = async (config?: TAxiosRequestConfig) =>
    (await API.get<TIndicators, AxiosResponse<TIndicators>>('indicators', { ...config })).data;
