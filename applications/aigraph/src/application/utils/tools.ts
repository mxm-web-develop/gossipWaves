export const uniqBy = (arr: any[], key: string) => {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
};

export const uniqArr2By = (array1: any[], array2: any[], key: string) => {
  return array2.filter((item2) => !array1.some((item1) => item1[key] === item2[key]));
};
