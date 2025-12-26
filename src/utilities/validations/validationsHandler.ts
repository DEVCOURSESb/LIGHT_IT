export const validationsHandler = () => {
  const fillString = ( value: string, fillNumber: number, fillwith: string): string => {
    const valueTrim = value.trim();

    if (valueTrim.length === fillNumber) return valueTrim;

    return Array(fillNumber - valueTrim.length)
      .fill(fillwith)
      .concat(valueTrim.split(""))
      .reduce((acc, value) => acc + value);
  };

  const minMaxString = ( value: string, minLength: number, maxLength: number): boolean => {
    const valueTrim = value.trim();
    return valueTrim.length >= minLength && valueTrim.length <= maxLength;
  }

  const minMax = ( value: number = 0, minValue: number, maxValue: number): boolean => {
    return value >= minValue && value <= maxValue;
  }

  const validateBoolean = ( value: boolean | undefined ): boolean => {
    return value !== undefined;
  }

  const transformBooleanToNumber = ( value: boolean ): number => {
    return value ? 1 : 2;
  }

  const transformNumberToBoolean = ( value: number ): boolean => {
    return value === 1;
  }

  const transformToUpperCase = ( value: string ): string => {
    return value.trim().toUpperCase();
  }

  return {
    fillString,
    minMaxString,
    minMax,
    validateBoolean,
    transformBooleanToNumber,
    transformNumberToBoolean,
    transformToUpperCase,
  };
};
