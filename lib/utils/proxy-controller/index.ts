import { BaseRequest } from "@/requests/base-request"
import { PersistentFetchOptionsCallback, SetResponsePersistentParamsOptions, SetResponseTrackOptions } from "@/types"

interface IProxyController {
    // setPersistentOptions: (callback:PersistentFetchOptionsCallback) => void;
    setResponseTrackCallback: (callbackParams:SetResponseTrackOptions) => void;
    deleteResponseTrackCallback: (callbackName:string) => void;
}

export class ProxyController implements IProxyController{
    // adds callback for each response (possibility for logging and metrics)
    setResponseTrackCallback(callbackParams: SetResponseTrackOptions){
        try {
            BaseRequest.responseTrackCallbacks.push(callbackParams);  
        } catch (error) {
            console.error('setResponseTrackCallback gets an error', error);
        }
    }

    // remove one of responseTrackCallbacks
    deleteResponseTrackCallback(callbackName:string){
        BaseRequest.responseTrackCallbacks = BaseRequest.responseTrackCallbacks.filter((responseTrackCallback)=>responseTrackCallback.name !== callbackName);
    }

    // adds params to all requests
    setPersistentOptions(callbackParams:SetResponsePersistentParamsOptions){
        try {
            BaseRequest.persistentOptionsGetters.push(callbackParams);
        } catch (error) {
            console.error('setPersistentOptions gets an error', error);
        }
    }

    // remove one of setPersistentOptions
    deletePersistentOptions(callbackName:string){
        try {
            BaseRequest.persistentOptionsGetters = BaseRequest.persistentOptionsGetters.filter((responseTrackCallback)=>responseTrackCallback.name !== callbackName);
        } catch (error) {
            console.error('setPersistentOptions gets an error', error);
        }
    }
}