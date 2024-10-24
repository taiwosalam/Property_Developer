// Function to filter properties that are objects
export const getObjectProperties = (obj: any, exceptions: string[] = []) => {
  const result: any = {};

  for (const key in obj) {
    if (exceptions.includes(key)) continue;

    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      result[key] = obj[key];
    }
  }

  return result;
};
