import { isNode } from '@/utils/is-node';

export const isFormData = (body: JSON | FormData) => {
  if (isNode()) {
    return false;
  }

  return body instanceof FormData;
};
