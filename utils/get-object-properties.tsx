// Function to filter properties that are objects
export const getObjectProperties = (obj: any) => {
  const result: any = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = obj[key];
    }
  }

  return result;
};
