// store/globalStore.ts
import { LandlordReportEntry } from "@/app/(nav)/reports/landlord/data";
import { TransformedProperty } from "@/app/(nav)/reports/properties/data";
import { Rent } from "@/app/(nav)/reports/rent/types";
import { ITenantListReport } from "@/app/(nav)/reports/tenants/data";
import { ActivityDataReport, UserActivity } from "@/app/(nav)/reports/tracking/[userId]/types";
import { UnitListRequest } from "@/app/(nav)/reports/units/types";
import { VehicleRecordsType } from "@/app/(nav)/reports/vehicles-record/types";
import { create } from "zustand";

interface GlobalStoreState {
  sponsorValue: number;
  properties?: TransformedProperty[] 
  landlords?: LandlordReportEntry[]
  tenants?: ITenantListReport[]
  units?: UnitListRequest[]
  vehicle_records?: VehicleRecordsType[]
  rents?: Rent[]
  activities?: ActivityDataReport[]
  user_activities?: ActivityDataReport[]
  // add more k
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
  properties: [],
  landlords: [],
  tenants: [],
  units: [],
  activities: [],
  vehicle_records: [],
  rent: [],
  user_activities: [],

  // type‑safe setter:
  setGlobalInfoStore: (key, value) => {
    set({ [key]: value } as Pick<GlobalStoreState, typeof key>);
  },

  // optional type‑safe getter:
  getGlobalInfoStore: (key) => {
    return get()[key];
  },
}));
