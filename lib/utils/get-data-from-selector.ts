type ParamsType = {
  selectedDataFields: Record<string, any>;
  responseData: any;
};

// TODO make it complex and recursive
export const getDataFromSelector = ({
  selectedDataFields,
  responseData,
}: ParamsType): any =>
  Object.keys(selectedDataFields).reduce((acc: any, selectedField: string) => {
    if (responseData[selectedField]) {
      return { ...acc, [selectedField]: responseData[selectedField] };
    }

    return acc;
  }, {});
