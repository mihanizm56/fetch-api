import { BaseRequest } from "@/requests/base-request"
import { PersistentFetchOptionsCallback } from "@/types"

interface IFetchProxyMaker {
    setPersistentOptions: (callback:PersistentFetchOptionsCallback) => void;
}

export class FetchProxyMaker implements IFetchProxyMaker{
    // TODO in future
    // setPrefetchMiddleware(callback,{}){}

    // TODO in future
    // setPostfetchMiddleware(callback,{}){}

    // adds params to all requests
    setPersistentOptions(callback:PersistentFetchOptionsCallback){
        BaseRequest.persistentOptions = callback();
    }
}