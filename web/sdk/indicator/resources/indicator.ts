import API from '../client';

import type {
    TIndicators,
    TIndicatorRequest,
} from '../types/DTO';
import type { TAxiosRequestConfig } from '../types/TRequestConfig';
import {AxiosResponse} from "axios";

export const getIndicators = async (config?: TAxiosRequestConfig) =>
    (await API.get<TIndicators, AxiosResponse<TIndicators>>('indicators', { ...config })).data;

export const upsertIndicator = async (code: string, data: TIndicatorRequest, config?: TAxiosRequestConfig) =>
    (await API.patch(`indicators/${code}`, {...data}, { ...config })).data;

export const deleteIndicator = async (code: string, config?: TAxiosRequestConfig) =>
    (await API.delete(`indicators/${code}`, { ...config })).data;
