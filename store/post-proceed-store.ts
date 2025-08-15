import { Occupant } from "@/components/Management/Rent And Unit/types";
import { initDataProps } from "@/app/(nav)/management/rent-unit/data";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

interface PostProceedState {
  selectedUnitId?: string;
  page?: "unit" | "property";
  propertyType?: "rental" | "facility";
  propertyId?: string;
  occupant: Occupant | null;
  propertyData: any | null;
  records: any | null;
  unitBalance: any | null;
  calculation: boolean;
  deduction: boolean;
  currentUnit: any | null;
  currentRentStats: any | null;
  unitData: any | null;
  startDate: string | null;
  modalIsOpen: boolean;
  reqLoading: boolean;
  tenantLoading: boolean;
  tenantError: Error | null;
  timeRange: string; // e.g., "7d", "30d", "90d", "custom"
  selectedDateRange: DateRange | undefined;
  [key: string]: any; // Allow dynamic key-value pairs
}

type PostProceedStore = PostProceedState & {
  setPostProceedInfo: <K extends keyof PostProceedState>(
    key: K,
    value: PostProceedState[K]
  ) => void;
  getPostProceedInfo: <K extends keyof PostProceedState>(
    key: K
  ) => PostProceedState[K];
  resetPostProceedState: () => void;
};

export const usePostProceedStore = create<PostProceedStore>((set, get) => ({
  // Initial values
  selectedUnitId: undefined,
  page: undefined,
  propertyType: undefined,
  propertyId: undefined,
  occupant: null,
  propertyData: null,
  records: null,
  unitBalance: null,
  calculation: false,
  deduction: false,
  currentUnit: null,
  currentRentStats: null,
  unitData: null,
  startDate: null,
  modalIsOpen: false,
  reqLoading: false,
  tenantLoading: false,
  tenantError: null,
  timeRange: "30d",
  selectedDateRange: undefined,

  // Type-safe setter
  setPostProceedInfo: (key, value) => {
    set({ [key]: value } as Pick<PostProceedState, typeof key>);
  },

  // Type-safe getter
  getPostProceedInfo: (key) => {
    return get()[key];
  },

  // Reset state
  resetPostProceedState: () => {
    set({
      selectedUnitId: undefined,
      page: undefined,
      propertyType: undefined,
      propertyId: undefined,
      occupant: null,
      propertyData: null,
      records: null,
      unitBalance: null,
      calculation: false,
      deduction: false,
      currentUnit: null,
      currentRentStats: null,
      unitData: null,
      startDate: null,
      modalIsOpen: false,
      reqLoading: false,
      tenantLoading: false,
      tenantError: null,
      timeRange: "30d",
      selectedDateRange: undefined,
    });
  },
}));
