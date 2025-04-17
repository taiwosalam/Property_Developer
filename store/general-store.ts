// store/globalStore.ts
import { create } from "zustand";

interface GlobalStoreState {
  sponsorValue: number;
  // add more keys here as needed…
}

type GlobalStore = GlobalStoreState & {
  setGlobalInfoStore: <K extends keyof GlobalStoreState>(
    key: K,
    value: GlobalStoreState[K]
  ) => void;

  getGlobalInfoStore: <K extends keyof GlobalStoreState>(
    key: K
  ) => GlobalStoreState[K];
};

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  // initial values:
  sponsorValue: 0,

  // type‑safe setter:
  setGlobalInfoStore: (key, value) => {
    set({ [key]: value } as Pick<GlobalStoreState, typeof key>);
  },

  // optional type‑safe getter:
  getGlobalInfoStore: (key) => {
    return get()[key];
  },
}));
