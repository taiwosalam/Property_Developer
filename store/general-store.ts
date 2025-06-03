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
import { initDataProps } from "@/app/(nav)/management/rent-unit/data";
import { DateRange } from "react-day-picker";
import { WalletStats } from "@/app/(nav)/wallet/data";
import {
  EnrollmentHistoryTable,
  ICampaignTable,
  SMSTable,
} from "@/components/Settings/sponsor_data";
import { EmailPageData } from "@/app/(nav)/reports/email/data";
import {
  ISponsoredListing,
  SponsoredListing,
} from "@/components/Settings/types";
import { Transactions } from "@/app/(nav)/management/staff-branch/[branchId]/types";
import { OtherAgreementDocumentOption } from "@/components/Documents/other-agreement";
import {
  ProfileSettingsPageState,
} from "@/app/(nav)/settings/company/data";
import { StaffChatTypes } from "@/app/(nav)/management/staff-branch/[branchId]/branch-staff/[staffId]/type";
import { PropertyCardProps } from "@/components/Management/Properties/property-card";
import { IVisitorsReportPageData } from "@/app/(nav)/reports/visitors/data";

interface GlobalStoreState {
  sponsorValue: number;
  managementProperties?: PropertyCardProps[];
  properties?: TransformedProperty[];
  landlords?: LandlordReportEntry[];
  tenants?: ITenantListReport[];
  units?: UnitListRequest[];
  vehicle_records?: VehicleRecordsType[];
  rents?: Rent[];
  emails?: EmailPageData;
  overduePeriods: number | null;
  visitorsRequest: IVisitorsReportPageData | null;
  staffChats: any | null;

  rentStartDate: string | null;
  rentEndDate: string | null;
  sms_transaction?: SMSTable;
  feature_history?: EnrollmentHistoryTable;
  campaign_history?: ICampaignTable[];
  sponsored_listing?: ISponsoredListing[];

  activities?: ActivityDataReport[];
  user_activities?: ActivityDataReport[];
  accounting_invoices?: Invoice[];
  accounting_statistics?: any;
  otherCurrencies?: {
    total: string;
    paid: string;
    pending: string;
  };

  accounting_vat?: Vat[];
  accounting_vat_data?: any | null;
  accounting_expenses?: Expense[];
  accounting_disbursements?: TransformedDisburseItem[];
  wallet_transactions?: Transaction[];
  selectedOccupant: Occupant | null;
  isPastDate: boolean;
  tenantLoading: boolean;
  tenantError: Error | null;
  currentUnit: any | null;
  currentRentStats: any | null;
  vatTimeRangeLabel?: string;
  timeRange: string; // e.g., "7d", "30d", "90d", "custom"
  timeRangeLabel: string;
  selectedDateRange: DateRange | undefined; // { from: Date, to: Date }
  unitData: initDataProps | null;
  setSelectedOccupant: (occupant: Occupant | null) => void;
  setIsPastDate: (isPast: boolean) => void;
  setUnitData: (data: initDataProps | null) => void;
  canSubmit: boolean;

  isValidDateRange: boolean,
  setIsValidDateRange: (isValid: boolean) => void;

  branchWalletTransactions: Transactions[] | null;

  wallet_stats?: WalletStats;
  wallet_date_range?: {
    timeRange: string;
    selectedDateRange: DateRange | undefined;
  };

  messageUserData: {
    branch_id: number;
    id: number;
    imageUrl: string;
    name: string;
    position: string; 
    last_seen?: string;
  } | null;

  openDocumentModal: boolean;
  selectedDocumentOption: OtherAgreementDocumentOption | null;
  
  profileSettingsData: ProfileSettingsPageState | null; 
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
  campaign_history: [],
  sponsored_listing: [],
  user_activities: [],
  accounting_invoices: [],
  accounting_statistics: null,
  accounting_vat: [],
  vatTimeRangeLabel: "Last 3 months",
  timeRangeLabel: "",
  accounting_expenses: [],
  accounting_disbursements: [],
  wallet_transactions: [],
  selectedOccupant: null,
  accounting_vat_data: null,
  isPastDate: false,
  tenantLoading: false,
  tenantError: null,
  currentUnit: null,
  isValidDateRange: true,
  setIsValidDateRange: (isValid: boolean) => set({ isValidDateRange: isValid }),
  currentRentStats: null,
  timeRange: "last_30_days",
  visitorsRequest: null,
  overduePeriods: null,
  staffChats: null,
  
  // timeRange: "90d",
  selectedDateRange: undefined,
  unitData: null,
  setSelectedOccupant: (occupant) => set({ selectedOccupant: occupant }),
  setIsPastDate: (isPast) => set({ isPastDate: isPast }),
  setUnitData: (data) => set({ unitData: data }),
  canSubmit: true,

  branchWalletTransactions: null,

  messageUserData: null,
  openDocumentModal: false,
  selectedDocumentOption: null,

  rentStartDate: null,
  rentEndDate: null,

  profileSettingsData: null,
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
