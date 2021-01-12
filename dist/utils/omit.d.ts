declare type ParamsType = {
    key: string;
    object: Record<string, any>;
};
export declare const getOmittedObject: ({ key, object, }: ParamsType) => Record<string, any>;
export {};
