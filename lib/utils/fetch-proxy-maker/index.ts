import { BaseRequest } from "@/requests/base-request"
import { PersistentFetchOptionsCallback,SetResponseTrackOptions } from "@/types"

interface IFetchProxyMaker {
    setPersistentOptions: (callback:PersistentFetchOptionsCallback) => void;
    setResponseTrackCallback: (callbackParams:SetResponseTrackOptions)=>void;
}

export class FetchProxyMaker implements IFetchProxyMaker{
    // possibility to get response fro logging and metrics
    setResponseTrackCallback(callbackParams: SetResponseTrackOptions){
        try {
            BaseRequest.responseTrackCallbacks.push(callbackParams);  
        } catch (error) {
            console.error('setResponseTrackCallback gets an error', error);
        }
    }

    deleteResponseTrackCallback(callbackName:string){
        BaseRequest.responseTrackCallbacks = BaseRequest.responseTrackCallbacks.filter((responseTrackCallback)=>responseTrackCallback.name !== callbackName);
    }

    // adds params to all requests
    setPersistentOptions(callback:PersistentFetchOptionsCallback){
        try {
        BaseRequest.persistentOptions = callback();
        } catch (error) {
            console.error('setPersistentOptions gets an error', error);
        }
    }
}