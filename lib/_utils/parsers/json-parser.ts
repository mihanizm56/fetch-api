export const jsonParser = (data: any) =>
  new Promise(resolve => resolve(data.json()));
