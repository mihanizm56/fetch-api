import { requestProtocolsMap } from '@/constants/shared';

export const getProtocolTypeIsRest = (type: keyof typeof requestProtocolsMap) =>
  type === requestProtocolsMap.rest;
