import { BaseRequest } from "@/requests/base-request"
import { CacheParams, MiddlewareParams } from "@/types"

interface ICachesController {
    setCache: (cacheParams:CacheParams) => void;
    // deleteResponseTrackCallback: (callbackName:string) => void;
}

export class CachesController implements ICachesController{
    // adds cache for each response
    setCache(cacheParams: CacheParams){
        try {
            BaseRequest.caches.push(cacheParams);  
        } catch (error) {
            console.error('setResponseTrackCallback gets an error', error);
        }
    }

    // remove one of caches
    deleteCache(cacheName:string){
        BaseRequest.caches = BaseRequest.caches.filter((cache)=>cache.name !== cacheName);
    }
}