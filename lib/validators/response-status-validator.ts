import { whitelistStatuses } from '../constants/statuses';

interface IStatusValidator {
  getStatusIsFromWhiteList: (status: number) => boolean;
}

export class StatusValidator implements IStatusValidator {
  public getStatusIsFromWhiteList = (status: number) =>
    Boolean(whitelistStatuses[status]);
}
