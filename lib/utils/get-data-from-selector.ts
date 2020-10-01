/*eslint-disable */
import jsonMask from 'json-mask';
/* eslint-enable */

type ParamsType = {
  selectData: string;
  responseData: any;
};

// TODO make it complex and recursive
export const getDataFromSelector = ({
  selectData,
  responseData,
}: ParamsType): any => jsonMask(responseData, selectData);
