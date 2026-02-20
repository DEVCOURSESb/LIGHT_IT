export const validationsHandler = () => {
  const fillString = ( value: string, fillNumber: number, fillwith: string): string => {
    const valueTrim = value.trim();

    if (valueTrim.length === fillNumber) return valueTrim;

    return Array(fillNumber - valueTrim.length)
      .fill(fillwith)
      .concat(valueTrim.split(""))
      .reduce((acc, value) => acc + value);
  };

  const minMaxString = ( value: string | undefined | null, minLength: number, maxLength: number): boolean => {
    if (!value) return false;
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
    return value ? 1 : 0;
  }

  const transformNumberToBoolean = ( value: number ): boolean => {
    return value === 1;
  }

  const transformToUpperCase = ( value: string ): string => {
    return value.trim().toUpperCase();
  }

  const allowUnderscore = ( value: string ): boolean => {
    const regex = /^[A-Za-z0-9_]+$/;
    return regex.test(value);
  }

  const noSpecialCharacters = ( value: string ): boolean => {
    const regex = /^[A-Za-z0-9\s]+$/;
    return regex.test(value);
  }

  const isValidDate = ( value: Date | null | undefined ): boolean => {
    if (!value) return false;
    
    // check if date is valid in format DD/MM/YYYY
    return value instanceof Date && !isNaN(value.getTime());
  }

  return {
    fillString,
    minMaxString,
    minMax,
    validateBoolean,
    transformBooleanToNumber,
    transformNumberToBoolean,
    transformToUpperCase,
    allowUnderscore,
    noSpecialCharacters,
    isValidDate,
  };
}
