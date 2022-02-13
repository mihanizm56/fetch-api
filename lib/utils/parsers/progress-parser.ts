import { ProgressOptionsType, ResponseParser } from '@/types';
import { parseTypesMap } from '@/constants';

type ProgressParseParamsType = {
  response: Response;
  progressOptions: ProgressOptionsType;
  parseType: keyof typeof parseTypesMap;
};

export const progressParse = async ({
  response,
  progressOptions: { onProgress, onLoaded },
  parseType,
}: ProgressParseParamsType) => {
  if (!response.body) {
    return null;
  }

  const reader = response.body.getReader();

  const contentLengthHeader = Number(response.headers.get('Content-Length'));
  const customLengthHeader = Number(
    response.headers.get('fetch-api-file-length'),
  );
  const contentLength = customLengthHeader || contentLengthHeader;

  let receivedLength = 0;
  const chunks = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = (await reader.read()) as {
      done: boolean;
      value: Uint8Array;
    };

    if (onProgress) {
      onProgress({ total: contentLength, current: receivedLength });
    }

    if (done) {
      if (onLoaded) {
        onLoaded(contentLength);
      }

      break;
    }

    chunks.push(value);
    receivedLength += value.length;
  }

  const chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;

  // TODO refactor because is too slow
  // eslint-disable-next-line
  for (const chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  const isText = parseType === parseTypesMap.text;
  const isJson = parseType === parseTypesMap.json;

  if (isText || isJson) {
    const responseInString = new TextDecoder('utf-8').decode(chunksAll);

    if (isText) {
      return responseInString;
    }

    if (isJson) {
      return JSON.parse(responseInString);
    }
  }

  const responseInBlob = new Blob(chunks);

  return responseInBlob;
};

export class ProgressParser extends ResponseParser {
  progressOptions: ProgressOptionsType;

  parseType: keyof typeof parseTypesMap;

  constructor({ parseType, progressOptions }: any) {
    super();

    this.parseType = parseType;
    this.progressOptions = progressOptions;
  }

  parse = (data: Response) => {
    return progressParse({
      response: data,
      parseType: this.parseType,
      progressOptions: this.progressOptions,
    });
  };
}
