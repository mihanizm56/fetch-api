export const openCache = async (
  storageCacheName: string,
): Promise<Cache | null> => {
  try {
    const cache = await caches.open(storageCacheName);

    return cache;
  } catch (error) {
    console.error('Error in openCache', error);

    return null;
  }
};
