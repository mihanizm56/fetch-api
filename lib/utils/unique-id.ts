let counter = 0;

// lodash uniqueId lol
export const uniqueId = (prefix: string): string => {
  const id = ++counter; // eslint-disable-line

  return prefix + id;
};
