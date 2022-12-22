export const openCache = async (
  storageCacheName: string,
): Promise<Cache | null> => {
  try {
    const cache = await caches.open(storageCacheName);

    return cache;
  } catch (error) {
    console.error('Can not open cache', error);

    return null;
  }
};
