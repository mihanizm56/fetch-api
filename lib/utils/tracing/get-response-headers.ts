/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

type OutputType = {
  responseHeaders: Record<string, string>;
  responseCookies: string;
};

export const getResponseHeaders = (response: Response): OutputType => {
  const responseHeaders: Record<string, string> = {};
  let responseCookies = '';

  for (const [key, value] of response.headers.entries()) {
    const isHeaderCookie =
      key === 'Set-Cookie' || key === 'set-cookie' || key === 'Set-cookie';

    if (isHeaderCookie) {
      responseCookies = `${responseCookies};${value}`;
      continue;
    }

    responseHeaders[key] = value;
  }

  return {
    responseHeaders,
    responseCookies,
  };
};
