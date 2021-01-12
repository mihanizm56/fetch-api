import { PersistentFetchOptionsCallback } from "../../types";
interface IFetchProxyMaker {
    setPersistentOptions: (callback: PersistentFetchOptionsCallback) => void;
}
export declare class FetchProxyMaker implements IFetchProxyMaker {
    setPersistentOptions(callback: PersistentFetchOptionsCallback): void;
}
export {};
