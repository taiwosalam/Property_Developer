export const saveSessionStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      try {
        const jsonData = JSON.stringify(data);
        sessionStorage.setItem(key, jsonData);
      } catch (error) {
        sessionStorage.setItem(key, data);
      }
    }
  };
  
  export const getSessionStorage = (key: string) => {
    if (typeof window !== "undefined") {
      try {
        const jsonData = sessionStorage.getItem(key);
        if (!jsonData) return null;
        return JSON.parse(jsonData);
      } catch (error) {
        return sessionStorage.getItem(key);
      }
    }
    return null;
  };
  
  export const removeSessionStorage = (key: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  };
  