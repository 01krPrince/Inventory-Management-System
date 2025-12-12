export const toNull = (value: any): any => {
  if (value === "" || value === undefined || value === "Select...") return null;
  return value;
};
