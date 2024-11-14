export const serializeToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  const appendFormData = (key: string, value: any) => {
    if (value instanceof Array) {
      value.forEach((item, index) => appendFormData(`${key}[${index}]`, item));
    } else if (value instanceof Object && !(value instanceof File)) {
      Object.entries(value).forEach(([subKey, subValue]) =>
        appendFormData(`${key}[${subKey}]`, subValue)
      );
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  };

  Object.entries(data).forEach(([key, value]) => appendFormData(key, value));

  return formData;
};
