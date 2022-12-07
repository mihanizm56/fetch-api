import { LOGS_STYLES } from '../_constants';

type ParamsType = {
  force?: boolean;
};

export const pruneRequestCaches = async ({ force }: ParamsType) => {
  try {
    const t1 = performance.now();
    const currentTimestamp = new Date().getTime();

    const prunedCaches: Array<string> = [];

    const projectCachesList = await caches.keys();

    // eslint-disable-next-line no-console
    console.log('%cPruneRequestCaches run', LOGS_STYLES.main);

    await Promise.allSettled(
      projectCachesList.map(async (projectCacheKey) => {
        const projectCache = await caches.open(projectCacheKey);

        const projectCachedRequests = await projectCache.keys();

        await Promise.allSettled(
          projectCachedRequests.map(async (projectCachedRequest) => {
            const response = await projectCache.match(projectCachedRequest.url);

            if (!response) {
              return;
            }

            const expires = response.headers.get('api-expires');

            if (!expires) {
              return;
            }

            // get string from response -> transform to number
            const formattedExpires = Number(expires) || 0;

            if (currentTimestamp > formattedExpires || force) {
              projectCache.delete(projectCachedRequest.url);

              prunedCaches.push(projectCachedRequest.url);

              // eslint-disable-next-line no-console
              console.log(
                `%cCache is expired and was deleted: ${projectCachedRequest.url}`,
                LOGS_STYLES.warning,
              );
            }
          }),
        );

        const updtedProjectCachedRequests = await projectCache.keys();

        // delete cache entirely if empty
        if (!updtedProjectCachedRequests.length) {
          await caches.delete(projectCacheKey);
        }
      }),
    );

    const t2 = performance.now();

    // eslint-disable-next-line no-console
    console.log('%cPruneRequestCaches result', LOGS_STYLES.main, {
      duration: t2 - t1,
      prunedCaches,
      prunedCachesCount: prunedCaches.length,
    });

    return {
      duration: t2 - t1,
      prunedCaches,
      prunedCachesCount: prunedCaches.length,
    };
  } catch (error) {
    console.error('Error in pruneRequestCaches', error);
  }
};
