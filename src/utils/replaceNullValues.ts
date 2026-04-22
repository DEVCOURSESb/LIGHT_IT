export function replaceNullValues<T extends Record<string, any>>(obj: T, replacement: string = "-",): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null || value === undefined || value === ""
        ? replacement
        : value,
    ]),
  ) as T;
}


export function replaceNullValuesInArray<T extends Record<string, any>>(arr: T[], replacement: string = "-"): T[] {
  return arr.map((obj) => replaceNullValues(obj, replacement));
}