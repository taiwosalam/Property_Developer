// Function to filter properties that are objects
const getObjectProperties = (obj: Record<string, string>) => {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = obj[key];
    }
  }

  return result;
};
