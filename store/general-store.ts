// store/globalStore.ts
import { TransformedDisburseItem } from "@/app/(nav)/accounting/disbursement/data";
import { Expense } from "@/app/(nav)/accounting/expenses/types.";
import { Invoice } from "@/app/(nav)/accounting/invoice/types";
import { Vat } from "@/app/(nav)/accounting/vat/data";
import { LandlordReportEntry } from "@/app/(nav)/reports/landlord/data";
import { TransformedProperty } from "@/app/(nav)/reports/properties/data";
import { Rent } from "@/app/(nav)/reports/rent/types";
import { ITenantListReport } from "@/app/(nav)/reports/tenants/data";
import {
  ActivityDataReport,
  UserActivity,
} from "@/app/(nav)/reports/tracking/[userId]/types";
import { UnitListRequest } from "@/app/(nav)/reports/units/types";
import { VehicleRecordsType } from "@/app/(nav)/reports/vehicles-record/types";
import { Occupant } from "@/components/Management/Rent And Unit/types";
import { create } from "zustand";
import { Transaction } from "./wallet-store";

interface GlobalStoreState {
  sponsorValue: number;
  properties?: TransformedProperty[];
  landlords?: LandlordReportEntry[];
  tenants?: ITenantListReport[];
  units?: UnitListRequest[];
  vehicle_records?: VehicleRecordsType[];
  rents?: Rent[];
  activities?: ActivityDataReport[];
  user_activities?: ActivityDataReport[];
  accounting_invoices?: Invoice[];
  accounting_vat?: Vat[];
  accounting_expenses?: Expense[];
  accounting_disbursements?: TransformedDisburseItem[];
  wallet_transactions?: Transaction[];
  selectedOccupant: Occupant | null;
  isPastDate: boolean;
  tenantLoading: boolean;
  tenantError: Error | null;
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

  resetTenantState: () => void;
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
  accounting_invoices: [],
  accounting_vat: [],
  accounting_expenses: [],
  accounting_disbursements: [],
  wallet_transactions: [],
  selectedOccupant: null,
  isPastDate: false,
  tenantLoading: false,
  tenantError: null,

  // type‑safe setter:
  setGlobalInfoStore: (key, value) => {
    set({ [key]: value } as Pick<GlobalStoreState, typeof key>);
  },

  // type‑safe getter:
  getGlobalInfoStore: (key) => {
    return get()[key];
  },

  // reset tenant
  resetTenantState: () => {
    set({
      selectedOccupant: null,
      isPastDate: false,
      tenantLoading: false,
      tenantError: null,
    });
  },
}));
