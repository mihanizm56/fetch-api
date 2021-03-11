/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

type OutputType = {
  responseHeaders: Record<string, string>;
  responseCookies: Record<string, string>;
};

export const getResponseHeaders = (response: Response): OutputType => {
  const responseHeaders: Record<string, string> = {};
  const responseCookies: Record<string, string> = {};

  for (const [key, value] of response.headers.entries()) {
    const isHeaderCookie =
      key === 'Set-Cookie' || key === 'set-cookie' || key === 'Set-cookie';

    if (isHeaderCookie) {
      responseCookies[key] = value;
      continue;
    }

    responseHeaders[key] = value;
  }

  return {
    responseHeaders,
    responseCookies,
  };
};
