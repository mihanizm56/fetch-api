import { BaseRequest } from '@/requests/base-request';
import { ICache } from '@/types';

interface ICachesController {
  setCache: (cacheParams: ICache) => void;
  deleteCache: () => void;
}

export class CachesController implements ICachesController {
  // adds cache for each request
  setCache(cache: ICache) {
    try {
      BaseRequest.cache = cache;
    } catch (error) {
      console.error('setCache gets an error', error);
    }
  }

  // remove cache for each request
  deleteCache() {
    delete BaseRequest.cache;
  }
}
