const MIN_STORAGE_LIMIT = 104857600; //  100mb

export const checkQuotaExceed = async (): Promise<boolean> => {
  try {
    const { quota, usage } = await navigator.storage.estimate();

    if (typeof quota === 'undefined' || typeof usage === 'undefined') {
      console.error('No quota params', {
        quota,
        usage,
      });

      return true;
    }

    if (quota - usage <= MIN_STORAGE_LIMIT) {
      console.error('Quota is unsafe, can not write to cache');

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in checkQuotaExceed', error);

    return true;
  }
};
