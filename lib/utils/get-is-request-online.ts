export const getIsRequestOnline = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return navigator.onLine;
};
