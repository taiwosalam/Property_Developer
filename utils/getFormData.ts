// Helper function to extract form data into a plain object
export const getFormData = (
  form: HTMLFormElement
): { [key: string]: FormDataEntryValue | FormDataEntryValue[] } => {
  const formData = new FormData(form);
  const data: { [key: string]: FormDataEntryValue } = {};

  // Convert FormData to a plain object
  formData.forEach((value, key) => {
    data[key] = value;
  });

  return data;
};
