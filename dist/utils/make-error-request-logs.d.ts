declare type ParamsType = {
    endpoint: string;
    errorRequestMessage: string;
    fetchBody?: any;
};
export declare const makeErrorRequestLogs: ({ endpoint, errorRequestMessage, fetchBody, }: ParamsType) => void;
export {};
