const MIN_STORAGE_LIMIT = 104857600; //  100mb

type ParamsType = {
  quotaExceedLimit?: number;
};

export const checkQuotaExceed = async ({
  quotaExceedLimit = MIN_STORAGE_LIMIT,
}: ParamsType): Promise<boolean> => {
  try {
    const { quota, usage } = await navigator.storage.estimate();

    if (typeof quota === 'undefined' || typeof usage === 'undefined') {
      console.error('No quota params', {
        quota,
        usage,
      });

      return true;
    }

    if (quota - usage <= quotaExceedLimit) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in checkQuotaExceed', error);

    return true;
  }
};
