/* eslint-disable no-console */

type ParamsType = {
  oldItemName: string;
  newItemName?: string;
};

export const deprecationLog = ({ oldItemName, newItemName }: ParamsType) =>
  newItemName
    ? console.warn(
        `${oldItemName} will be deprecated in the next major release, please use ${newItemName} instead`,
      )
    : console.warn(
        `${oldItemName} will be deprecated in the next major release`,
      );
