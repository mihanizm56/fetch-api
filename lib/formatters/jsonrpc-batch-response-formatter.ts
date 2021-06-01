import {
  ResponseFormatter,
  TranslateFunctionType,
  IJSONRPCPureResponse,
  IResponse,
  IJSONPRCRequestFormattedBodyParams,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';
import { FormatDataTypeValidator } from '@/validators/response-type-validator';
import { ID_REGEX, NETWORK_ERROR_KEY } from '@/constants';
import { JSONRPCResponseFormatter } from './jsonrpc-response-formatter';

type ParamsType = {
  data: Array<IJSONRPCPureResponse>;
  isErrorTextStraightToOutput?: boolean;
  statusCode: number;
  translateFunction?: TranslateFunctionType;
  responseSchema?: Array<any>;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
};


export class JSONRPCBatchResponseFormatter extends ResponseFormatter {
  data: Array<IJSONRPCPureResponse>;

  isErrorTextStraightToOutput?: boolean;

  statusCode: number;

  responseSchema?: Array<any>;

  translateFunction?: TranslateFunctionType;

  body?: Array<IJSONPRCRequestFormattedBodyParams>;

  constructor({
    data,
    isErrorTextStraightToOutput,
    statusCode,
    translateFunction,
    responseSchema,
    body,
  }: ParamsType) {
    super();
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.statusCode = statusCode;
    this.translateFunction = translateFunction;
    this.responseSchema = responseSchema;
    this.body = body;
  }

  getSortedByIDsBatchResponse = () => {
    return  this.data.sort((next,prev)=>{
      try {
        const prevNumber = ID_REGEX.test(`${prev.id}`) ?  Number(`${prev.id}`.replace(ID_REGEX,'')) : 0;
        const nextNumber = ID_REGEX.test(`${next.id}`) ?  Number(`${next.id}`.replace(ID_REGEX,'')) : 0;
      
        return nextNumber - prevNumber        
      } catch (error) {
        console.error('error in getSortedByIDsBatchResponse',error);
        return 0
      }

    })
  }

  getFormattedData = () =>{
    const sortedData = this.getSortedByIDsBatchResponse();

    console.log('sortedData',sortedData);
    

    return sortedData.map((responseItemData, index) => {
      const validator = new FormatDataTypeValidator();
      const prevId = this.body ? this.body[index].id : null;
      const schema = this.responseSchema ? this.responseSchema[index] : null;
      const dataItemCode = responseItemData.error ? 500 : 200;

      const isFormatValid = validator.getJSONRPCFormatIsValid({
        response: responseItemData,
        schema,
        prevId,
      });

      if (isFormatValid) {
        return new JSONRPCResponseFormatter({
          ...responseItemData,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          statusCode: dataItemCode,
          translateFunction: this.translateFunction,
        }).getFormattedResponse();
      }

      return new ErrorResponseFormatter().getFormattedErrorResponse({
        errorDictionaryParams: {
          errorTextKey: NETWORK_ERROR_KEY,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          translateFunction: this.translateFunction,
          statusCode: 500,
        },
        statusCode: 500,
      });
    });
  }


  getFormattedResponse = (): IResponse => {
    const formattedData = this.getFormattedData();

    return {
      errorText: '',
      error: false,
      data: formattedData,
      additionalErrors: null,
      code: this.statusCode,
    };
  };
}
