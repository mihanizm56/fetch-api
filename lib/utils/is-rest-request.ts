import { requestProtocolsMap } from '@/constants/shared';

export const isRestRequest = (
  requestProtocol: keyof typeof requestProtocolsMap,
): boolean => requestProtocol === requestProtocolsMap.rest;
