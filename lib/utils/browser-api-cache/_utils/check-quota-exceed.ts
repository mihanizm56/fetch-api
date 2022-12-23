import { CacheStateType } from '../_types';

const DEFAULT_MIN_ALLOWED_QUOTA = 10485760; //  10mb

type ParamsType = {
  minAllowedQuota?: number;
};

type OutputType = {
  quotaExceed: boolean;
  cacheState: CacheStateType;
};

export const checkQuotaExceed = async ({
  minAllowedQuota = DEFAULT_MIN_ALLOWED_QUOTA,
}: ParamsType): Promise<OutputType> => {
  try {
    const { quota, usage } = await navigator.storage.estimate();

    const cacheState = {
      quota,
      usage,
      minAllowedQuota,
    };

    if (typeof quota === 'undefined' || typeof usage === 'undefined') {
      console.error('No quota params', {
        quota,
        usage,
      });

      return {
        quotaExceed: true,
        cacheState,
      };
    }

    if (quota - usage <= minAllowedQuota) {
      return {
        quotaExceed: true,
        cacheState,
      };
    }

    return {
      quotaExceed: false,
      cacheState,
    };
  } catch (error) {
    console.error('Error in checkQuotaExceed', error);

    return {
      quotaExceed: true,
      cacheState: {
        quota: 0,
        usage: 0,
        minAllowedQuota: 0,
      },
    };
  }
};
