/* eslint-disable */
import { CustomSelectorDataType } from '@/types';
import jsonMask from 'json-mask';
/* eslint-enable */

type ParamsType = {
  selectData?: string;
  responseData: any;
  customSelectorData?: CustomSelectorDataType;
};

export const getDataFromSelector = ({
  selectData,
  responseData,
  customSelectorData,
}: ParamsType): any =>
  customSelectorData
    ? {
        ...responseData,
        data: customSelectorData(responseData.data, selectData),
      }
    : { ...responseData, data: jsonMask(responseData.data, selectData) };
