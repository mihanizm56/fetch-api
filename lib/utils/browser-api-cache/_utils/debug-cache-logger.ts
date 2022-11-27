/* eslint-disable no-console */
import { LogStylesTypeEnum, LOGS_STYLES } from '../_constants';

type ParamsType = {
  debug?: boolean;
} & Record<string, any>;

type LogType = {
  log: string;
  type: keyof typeof LogStylesTypeEnum;
};

export class DebugCacheLogger {
  opened = false;

  requestCacheKey = '';

  logsArray: Array<LogType> = [];

  openLogsGroup = ({ debug, requestCacheKey }: ParamsType) => {
    if (debug) {
      this.opened = true;
      this.requestCacheKey = requestCacheKey;
    }
  };

  writeLogs = () => {
    console.groupCollapsed(
      `%cRequest Cache Info ${this.requestCacheKey}}`,
      LOGS_STYLES.main,
    );
    this.logsArray.forEach(({ log, type }) => {
      console.log(`%c${log}`, LOGS_STYLES[type]);
    });

    console.groupEnd();
  };

  closeLogsGroup = ({ debug }: ParamsType) => {
    if (debug) {
      this.writeLogs();
      this.opened = false;
    }
  };

  logParams = ({ debug, params }: ParamsType) => {
    if (debug) {
      this.logsArray.push({
        log: `Cache Params: ${params}`,
        type: 'main',
      });
    }
  };

  logCacheIsMatched = ({ debug, cacheMatched }: ParamsType) => {
    if (debug) {
      this.logsArray.push({
        log: `Cache is matched: ${cacheMatched}`,
        type: 'success',
      });
    }
  };

  logCacheIsExpired = ({ debug }: ParamsType) => {
    if (debug) {
      this.logsArray.push({
        log: 'Cache is expired',
        type: 'warning',
      });
    }
  };

  logUpdatedCache = ({ debug, value }: ParamsType) => {
    if (debug) {
      this.logsArray.push({
        log: `Cache is updated, new value: ${value}`,
        type: 'success',
      });
    }
  };

  logNotUpdatedCache = ({ debug, response }: ParamsType) => {
    if (debug) {
      this.logsArray.push({
        log: `Cache is not updated: response with error: ${response}`,
        type: 'error',
      });
    }
  };

  logDisabledCache = ({ debug }: ParamsType) => {
    if (debug) {
      this.logsArray.push({
        log: 'Cache is disabled',
        type: 'warning',
      });
    }
  };
}
