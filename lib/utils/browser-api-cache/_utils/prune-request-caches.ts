import { LOGS_STYLES } from '../_constants';

type ParamsType = {
  force?: boolean;
};

export const pruneRequestCaches = async ({ force }: ParamsType) => {
  try {
    const currentTimestamp = new Date().getTime();

    const projectCachesList = await caches.keys();

    Promise.allSettled(
      projectCachesList.map(async (projectCacheKey) => {
        const projectCache = await caches.open(projectCacheKey);

        const projectCachedRequests = await projectCache.keys();

        await Promise.allSettled(
          projectCachedRequests.map(async (projectCachedRequest) => {
            const response = await projectCache.match(projectCachedRequest.url);

            if (!response) {
              return;
            }

            const expires = response.headers.get('expires');

            if (!expires) {
              return;
            }

            // get string from response -> transform to number
            const formattedExpires = Number(expires) || 0;

            if (currentTimestamp > formattedExpires || force) {
              projectCache.delete(projectCachedRequest.url);

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
  } catch (error) {
    console.error('Error in pruneRequestCaches', error);
  }
};
