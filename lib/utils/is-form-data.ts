import { isNode } from '@/utils/is-node';

export const isFormData = (body: JSON | FormData) => {
  if (isNode()) {
    return body?.constructor?.name === 'FormData';
  }

  return body instanceof FormData;
};
