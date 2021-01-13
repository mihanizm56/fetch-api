import { ProgressOptionsType, ResponseParser } from '@/types';
import { parseTypesMap } from '@/constants';

type ProgressParseOptionsType = {
  progressOptions: ProgressOptionsType;
  parseType: keyof typeof parseTypesMap;
};

export const progressParse = async (
  response: Response,
  {
    progressOptions: { onProgress, onLoaded },
    parseType,
  }: ProgressParseOptionsType,
) => {
  if (!response.body) {
    return null;
  }

  const reader = response.body.getReader();

  const contentLength = Number(response.headers.get('Content-Length'));

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

    // console.log(`Получено ${receivedLength} из ${contentLength}`);
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
  parse = (data: Response, options: ProgressParseOptionsType) =>
    progressParse(data, options);
}
