import { create } from "zustand";

interface AddUnitStore {
  images: File[];
  addImages: (newImages: File[]) => void;
  removeImage: (index: number) => void;
}

export const useAddUnitStore = create<AddUnitStore>((set) => ({
  images: [],
  addImages: (newImages) =>
    set((state) => {
      // Limit the number of images to a maximum of 14
      const totalImages = state.images.length + newImages.length;
      if (totalImages > 14) {
        const allowedImages = newImages.slice(0, 14 - state.images.length);
        return { images: [...state.images, ...allowedImages] };
      }
      return { images: [...state.images, ...newImages] };
    }),
  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
}));

// export const useAddUnitStoreSelectors = {
//   getState: useAddUnitStore.getState,
//   setState: useAddUnitStore.setState,
// };
