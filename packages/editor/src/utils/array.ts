export const move = <T extends object>(arr: Array<T>, fromIndex: number, toIndex: number) => {
  const element = arr.at(fromIndex);
  if (!element) {
    return;
  }
  remove(arr, fromIndex);
  add(arr, element, toIndex);
};

export const remove = <T extends object>(arr: Array<T>, index: number) => {
  return arr.splice(index, 1)[0];
};

export const add = <T extends object>(arr: Array<T>, element: T, index: number) => {
  arr.splice(index, 0, element);
};
