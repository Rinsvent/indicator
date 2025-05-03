export type TServerErrorData = {
    summary: string;
    code?: number;
    codeText?: string;
    path?: string;
    message?: string;
    parameters?: object;
};

export type TServerErrorList = { errors?: TServerErrorData[] };

export type TServerError = TServerErrorList | TServerErrorData;