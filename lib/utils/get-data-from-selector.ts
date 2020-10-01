/*eslint-disable */
import jsonMask from 'json-mask';
/* eslint-enable */

type ParamsType = {
  selectedDataFields: string;
  responseData: any;
};

// TODO make it complex and recursive
export const getDataFromSelector = ({
  selectedDataFields,
  responseData,
}: ParamsType): any => jsonMask(responseData, selectedDataFields);
