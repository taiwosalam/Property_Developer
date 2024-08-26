import { create } from "zustand";

// Define  type for form data
interface FormData {
  username?: string;
  email?: string;
  //   // Add more fields as needed
}

interface FormDataState {
  formData: Record<string, any>; // Replace with FormData if you have a specific structure
  updateFormData: (data: Record<string, any>) => void;
}

export const useFormDataStore = create<FormDataState>((set) => ({
  formData: {},
  updateFormData: (data: Record<string, any>) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}));

export const useFormDataStoreSelectors = {
  getState: useFormDataStore.getState,
  setState: useFormDataStore.setState,
};
