// eslint-disable-next-line no-shadow
export enum LogStylesTypeEnum {
  main = 'main',
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export const LOGS_STYLES: Record<keyof typeof LogStylesTypeEnum, string> = {
  main: 'color: blue;padding:3px;',
  success: 'color: green;padding:3px;',
  error: 'color: white;background:red;padding:3px;',
  warning: 'color: black;background:orange;padding:3px;',
};
