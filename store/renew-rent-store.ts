// import { create } from "zustand";
// import { Dayjs } from "dayjs";
// import { toast } from "sonner";
// import { startRent } from "@/app/(nav)/management/rent-unit/[id]/start-rent/data";
// import {
//   CheckBoxOptions,
//   defaultChecks,
// } from "@/components/Management/Rent And Unit/data";
// import useFetch from "@/hooks/useFetch";
// import {
//   initData,
//   initDataProps,
//   singleUnitApiResponse,
//   transformUnitData,
// } from "@/app/(nav)/management/rent-unit/data";

// interface RenewRentState {
//   unitData: initDataProps;
//   startDate: Dayjs | null;
//   dueDate: Dayjs | null;
//   selectedCheckboxOptions: CheckBoxOptions;
//   reqLoading: boolean;
//   apiLoading: boolean;
//   apiError: string | null;
//   isNetworkError: boolean;
//   fetchUnitData: (unitId: string) => Promise<void>;
//   setStartDate: (date: Dayjs | null) => void;
//   setDueDate: (date: Dayjs | null) => void;
//   setSelectedCheckboxOptions: (options: CheckBoxOptions) => void;
//   renewRent: (unitId: string, tenantId: string) => Promise<void>;
//   reset: () => void;
// }

// export const useRenewRentStore = create<RenewRentState>((set, get) => ({
//   unitData: initData,
//   startDate: null,
//   dueDate: null,
//   selectedCheckboxOptions: defaultChecks,
//   reqLoading: false,
//   apiLoading: false,
//   apiError: null,
//   isNetworkError: false,

//   fetchUnitData: async (unitId: string) => {
//     set({ apiLoading: true, apiError: null, isNetworkError: false });
//     try {
//       const { data, isNetworkError, error } =
//         await useFetch<singleUnitApiResponse>(`/unit/${unitId}/view`);
//       if (isNetworkError) {
//         set({ isNetworkError: true });
//         return;
//       }
//       if (error) {
//         set({ apiError: error });
//         return;
//       }
//       if (data) {
//         set({ unitData: { ...initData, ...transformUnitData(data) } });
//       }
//     } catch (err) {
//       set({ apiError: new Error("Failed to fetch unit data") });
//     } finally {
//       set({ apiLoading: false });
//     }
//   },

//   setStartDate: (date) => set({ startDate: date }),

//   setDueDate: (date) => set({ dueDate: date }),

//   setSelectedCheckboxOptions: (options) =>
//     set({ selectedCheckboxOptions: options }),

//   renewRent: async (unitId: string, tenantId: string) => {
//     const { startDate, selectedCheckboxOptions, unitData } = get();
//     if (!unitId || !tenantId) {
//       toast.error("Missing required information: unit or occupant not found.");
//       return;
//     }
//     if (!selectedCheckboxOptions) {
//       toast.error("Notification preferences not set.");
//       return;
//     }
//     if (!startDate) {
//       toast.error("Start date is required.");
//       return;
//     }
//     if (get().dueDate?.isBefore(startDate, "day")) {
//       toast.warning("Due date cannot be before the start date.");
//       return;
//     }

//     const payload = {
//       unit_id: unitId,
//       tenant_id: tenantId,
//       start_date: startDate,
//       payment_type: "full",
//       rent_type: "renew",
//       mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
//       email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
//       has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0,
//       rent_agreement: selectedCheckboxOptions.rent_agreement ? 1 : 0,
//     };

//     set({ reqLoading: true });
//     try {
//       const res = await startRent(payload);
//       if (res) {
//         toast.success("Rent Renewed Successfully");
//       }
//     } catch (err) {
//       toast.error("Failed to renew rent");
//     } finally {
//       set({ reqLoading: false });
//     }
//   },

//   reset: () =>
//     set({
//       unitData: initData,
//       startDate: null,
//       dueDate: null,
//       selectedCheckboxOptions: defaultChecks,
//       reqLoading: false,
//       apiLoading: false,
//       apiError: null,
//       isNetworkError: false,
//     }),
// }));
