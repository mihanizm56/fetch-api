/* eslint-disable no-console */
import { LogStylesTypeEnum, LOGS_STYLES } from '../_constants';

type ParamsType = {
  debug?: boolean;
};

type LogType = {
  log: string;
  type: keyof typeof LogStylesTypeEnum;
};

export class DebugCacheLogger {
  opened = false;

  requestCacheKey = '';

  logsArray: Array<LogType> = [];

  debug?: boolean = false;

  constructor({ debug }: ParamsType) {
    this.debug = debug;
  }

  openLogsGroup = ({ requestCacheKey }: Record<string, any>) => {
    if (!this.debug) {
      return;
    }

    this.opened = true;
    this.requestCacheKey = requestCacheKey;
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

  closeLogsGroup = () => {
    if (!this.debug) {
      return;
    }

    this.writeLogs();
    this.opened = false;
  };

  logParams = ({ params }: Record<string, any>) => {
    if (!this.debug) {
      return;
    }

    this.logsArray.push({
      log: `Cache Params: ${params}`,
      type: 'main',
    });
  };

  logCacheIsMatched = ({ cacheMatched }: Record<string, any>) => {
    if (!this.debug) {
      return;
    }

    this.logsArray.push({
      log: `Cache is matched: ${cacheMatched}`,
      type: cacheMatched ? 'success' : 'warning',
    });
  };

  logCacheIsExpired = () => {
    if (!this.debug) {
      return;
    }

    this.logsArray.push({
      log: 'Cache is expired',
      type: 'warning',
    });
  };

  logUpdatedCache = () => {
    if (!this.debug) {
      return;
    }

    this.logsArray.push({
      log: 'Cache is updated',
      type: 'success',
    });
  };

  logNotUpdatedCache = ({ response }: Record<string, any>) => {
    if (!this.debug) {
      return;
    }

    this.logsArray.push({
      log: `Cache is not updated: response with error: ${response}`,
      type: 'error',
    });
  };

  logDisabledCache = () => {
    if (!this.debug) {
      return;
    }

    this.logsArray.push({
      log: 'Cache is disabled',
      type: 'warning',
    });
  };
}
