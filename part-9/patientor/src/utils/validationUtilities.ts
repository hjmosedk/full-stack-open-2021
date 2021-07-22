//* This function is from stackoverflow
const isValidDate = (date: string): boolean => {
  return !isNaN(new Date(date).getDate());
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const validateDate = (date: unknown): boolean => {
  if (!isString(date) || !isDate(date) || !isValidDate(date)) {
    return false;
  }
  return true;
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};
