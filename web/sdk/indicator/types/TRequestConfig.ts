import type { AxiosRequestConfig } from 'axios';

export type TRequestExtraConfig = {
    skipAuthError?: boolean;
};

export interface TAxiosRequestConfig extends AxiosRequestConfig {
    _extra?: TRequestExtraConfig;
}