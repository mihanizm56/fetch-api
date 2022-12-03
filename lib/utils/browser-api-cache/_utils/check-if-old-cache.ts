type ParamsType = {
  cacheMatch?: Response;
  timestamp: number;
};

type OutputType<ResponseType> = {
  old: boolean;
  cachedResponse?: ResponseType;
};

export const checkIfOldCache = async <ResponseType>({
  timestamp,
  cacheMatch,
}: ParamsType): Promise<OutputType<ResponseType>> => {
  if (!cacheMatch) {
    return {
      old: true,
    };
  }

  const cachedTimestamp = Number(cacheMatch.headers.get('api-expires')) || 0;

  const cachedValue = await cacheMatch.json();

  if (timestamp - cachedTimestamp > 0) {
    return {
      old: true,
    };
  }

  return {
    old: false,
    cachedResponse: cachedValue,
  };
};
