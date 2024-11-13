export const saveLocalStorage = (key: string, data: any) => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  } catch (error) {
    // console.log("error in stringify saveLocalStorage", error);
    localStorage.setItem(key, data);
  }
};

export const getLocalStorage = (key: string) => {
  try {
    const jsonData = localStorage.getItem(key);
    if (!jsonData) return null;
    const parsedData = JSON.parse(jsonData);
    return parsedData;
  } catch (error) {
    // console.log("error in parse getLocalStorage", error);
    return localStorage.getItem(key);
  }
};
