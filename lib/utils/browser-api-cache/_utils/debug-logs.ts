/* eslint-disable no-console */
import { LOGS_STYLES } from '../_constants';

type ParamsType = {
  debug?: boolean;
} & Record<string, any>;

export const openLogsGroup = ({ debug, requestCacheKey }: ParamsType) => {
  if (debug) {
    console.group(`%cRequest Cache Info ${requestCacheKey}}`, LOGS_STYLES.main);
  }
};
export const closeLogsGroup = ({ debug }: ParamsType) => {
  if (debug) {
    console.groupEnd();
  }
};

export const logParams = ({ debug, params }: ParamsType) => {
  if (debug) {
    console.log(`%cCache Params: ${params}`, LOGS_STYLES.main);
  }
};

export const logCacheIsMatched = ({ debug, cacheMatched }: ParamsType) => {
  if (debug) {
    console.log(`%cCache is matched: ${cacheMatched}`, LOGS_STYLES.success);
  }
};

export const logCacheIsExpired = ({ debug }: ParamsType) => {
  if (debug) {
    console.log('%cCache is expired', LOGS_STYLES.warning);
  }
};

export const logUpdatedCache = ({ debug, value }: ParamsType) => {
  if (debug) {
    console.log(`%cCache is updated, new value: ${value}`, LOGS_STYLES.success);
  }
};

export const logNotUpdatedCache = ({ debug, response }: ParamsType) => {
  if (debug) {
    console.log(
      `%cCache is not updated: response with error: ${response}`,
      LOGS_STYLES.error,
    );
  }
};

export const logDisabledCache = ({ debug }: ParamsType) => {
  if (debug) {
    console.log('%cCache is disabled', LOGS_STYLES.warning);
  }
};
