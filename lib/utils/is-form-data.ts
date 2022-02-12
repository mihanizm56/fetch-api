import { getIsNode } from '@/utils/is-node';

export const isFormData = (body: JSON | FormData) => {
  const isNode = getIsNode();

  if (isNode) {
    return body?.constructor?.name === 'FormData';
  }

  return body instanceof FormData;
};
