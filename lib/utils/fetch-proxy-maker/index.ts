import { BaseRequest } from "@/requests/base-request"
import { PersistentFetchOptionsCallback,SetResponseTrackCallback } from "@/types"

interface IFetchProxyMaker {
    setPersistentOptions: (callback:PersistentFetchOptionsCallback) => void;
    setResponseTrackCallback: (callback:SetResponseTrackCallback)=>void;
}

export class FetchProxyMaker implements IFetchProxyMaker{
    // possibility to get response fro logging and metrics
    setResponseTrackCallback(callback: SetResponseTrackCallback){
        try {
            BaseRequest.responseTrackCallback = callback;  
        } catch (error) {
            console.error('setResponseTrackCallback gets an error', error);
        }
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