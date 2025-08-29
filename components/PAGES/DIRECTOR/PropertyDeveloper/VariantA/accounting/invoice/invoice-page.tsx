"use client";

import CreateInvoiceModal from "@/components/Accounting/invoice/CreateInvoiceModal";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import SearchInput from "@/components/SearchInput/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExclamationMark } from "@/public/icons/icons";
import ExportButton from "@/components/reports/export-button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import MenuItem from "@mui/material/MenuItem";
import type { DataItem } from "@/components/Table/types";
import useDarkMode from "@/hooks/useCheckDarkMode";
import TableMenu from "@/components/Table/table-menu";
import CustomLoader from "@/components/Loader/CustomLoader";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import useStaffRoles from "@/hooks/getStaffs";
import { parseHTML } from "@/utils/parse-html";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import {
  accountingInvoiceOptionsWithDropdown,
  invoiceTableData,
  invoiceTableFields,
} from "./data";

// Mock Data Types
interface InvoiceStatistics {
  total_receipt: number;
  percentage_change_total: number;
  total_paid_receipt: number;
  percentage_change_paid: number;
  total_pending_receipt: number;
  percentage_change_pending: number;
}

interface TransformedInvoice {
  id: string;
  client_name: string;
  payment_reason: string;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  due_date: string;
  created_at: string;
  currency: string;
  is_auto: boolean;
  badge_color?: string;
  property_id: string;
  account_officer_id: string;
}

interface TransformedInvoiceData {
  statistics: InvoiceStatistics;
  invoices: TransformedInvoice[];
}

interface Property {
  id: number;
  title: string;
  units: any[];
}

interface AccountOfficer {
  id: number;
  name: string;
}

interface OtherCurrency {
  currency: string;
  amount: number;
}

// Mock Data
export const mockInvoiceStatistics: InvoiceStatistics = {
  total_receipt: 2450000,
  percentage_change_total: 15.2,
  total_paid_receipt: 1850000,
  percentage_change_paid: 8.7,
  total_pending_receipt: 600000,
  percentage_change_pending: -12.3,
};

export const mockInvoices: TransformedInvoice[] = [
  {
    id: "INV-001",
    client_name: "John Smith",
    payment_reason: "Monthly Rent - Apartment 2B",
    total_amount: 150000,
    amount_paid: 150000,
    balance_due: 0,
    status: "Paid",
    due_date: "2024-01-15",
    created_at: "2024-01-01",
    currency: "NGN",
    is_auto: true,
    badge_color: "#22C55E",
    property_id: "1",
    account_officer_id: "1",
  },
  {
    id: "INV-002",
    client_name: "Sarah Johnson",
    payment_reason: "Security Deposit - Studio Unit",
    total_amount: 200000,
    amount_paid: 100000,
    balance_due: 100000,
    status: "Partially Paid",
    due_date: "2024-01-20",
    created_at: "2024-01-05",
    currency: "NGN",
    is_auto: false,
    badge_color: "#F59E0B",
    property_id: "2",
    account_officer_id: "2",
  },
  {
    id: "INV-003",
    client_name: "Michael Brown",
    payment_reason: "Monthly Rent - Office Space 3A",
    total_amount: 300000,
    amount_paid: 0,
    balance_due: 300000,
    status: "Pending",
    due_date: "2024-02-01",
    created_at: "2024-01-15",
    currency: "NGN",
    is_auto: true,
    property_id: "3",
    account_officer_id: "1",
  },
  {
    id: "INV-004",
    client_name: "Emily Davis",
    payment_reason: "Utility Bills - December",
    total_amount: 45000,
    amount_paid: 45000,
    balance_due: 0,
    status: "Paid",
    due_date: "2024-01-10",
    created_at: "2023-12-28",
    currency: "NGN",
    is_auto: false,
    property_id: "1",
    account_officer_id: "3",
  },
  {
    id: "INV-005",
    client_name: "Robert Wilson",
    payment_reason: "Commercial Space Rent",
    total_amount: 500000,
    amount_paid: 0,
    balance_due: 500000,
    status: "Pending",
    due_date: "2024-02-15",
    created_at: "2024-01-20",
    currency: "USD",
    is_auto: true,
    badge_color: "#EF4444",
    property_id: "4",
    account_officer_id: "2",
  },
  {
    id: "INV-006",
    client_name: "Lisa Anderson",
    payment_reason: "Maintenance Fee - Q1",
    total_amount: 75000,
    amount_paid: 0,
    balance_due: 75000,
    status: "Cancel",
    due_date: "2024-01-25",
    created_at: "2024-01-10",
    currency: "NGN",
    is_auto: false,
    property_id: "2",
    account_officer_id: "3",
  },
];

const mockProperties: Property[] = [
  { id: 1, title: "Sunset Apartments", units: [{ id: 1 }, { id: 2 }] },
  { id: 2, title: "Downtown Office Complex", units: [{ id: 3 }, { id: 4 }] },
  { id: 3, title: "Marina View Condos", units: [{ id: 5 }] },
  {
    id: 4,
    title: "Business District Plaza",
    units: [{ id: 6 }, { id: 7 }, { id: 8 }],
  },
];

export const mockAccountOfficers: AccountOfficer[] = [
  { id: 1, name: "Alice Cooper" },
  { id: 2, name: "Bob Miller" },
  { id: 3, name: "Carol White" },
];

// Utility function to get other currencies (mocked implementation)
const getOtherCurrency = (
  invoices: TransformedInvoice[],
  dateRange?: any,
  field?: string
): OtherCurrency[] => {
  const usdInvoices = invoices.filter((inv) => inv.currency === "USD");
  const totalUSD = usdInvoices.reduce((sum, inv) => {
    switch (field) {
      case "total_amount":
        return sum + inv.total_amount;
      case "amount_paid":
        return sum + inv.amount_paid;
      case "balance_due":
        return sum + inv.balance_due;
      default:
        return sum + inv.total_amount;
    }
  }, 0);

  return totalUSD > 0 ? [{ currency: "USD", amount: totalUSD }] : [];
};

const AccountingInvoicePage = () => {
  const isDarkMode = useDarkMode();
  const searchParams = useSearchParams();
  const {
    setGlobalInfoStore,
    otherCurrencies,
    invoiceTimeRange,
    selectedDateRange,
    timeRangeLabel,
  } = useGlobalStore((s) => ({
    setGlobalInfoStore: s.setGlobalInfoStore,
    otherCurrencies: s.otherCurrencies,
    invoiceTimeRange: s.invoiceTimeRange,
    selectedDateRange: s.selectedDateRange,
    timeRangeLabel: s.timeRangeLabel,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [silentLoading, setSilentLoading] = useState(false);

  // Mock data state
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData>({
    statistics: mockInvoiceStatistics,
    invoices: mockInvoices,
  });

  // Mock property and account officer data
  const propertyData = { data: mockProperties };
  const propertyError = null;
  const propertyLoading = false;

  // Mock staff roles hook
  const getAccountOfficers = () => mockAccountOfficers;
  const loadingStaffs = false;
  const staffsError = null;
  const accountOfficers = getAccountOfficers();

  const propertyOptions = Array.isArray(propertyData?.data)
    ? [
        ...new Map(
          propertyData.data
            .filter((property: any) => property.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(),
              {
                label: property.title.toLowerCase(),
                value: property.id.toString(),
              },
            ])
        ).values(),
      ]
    : [];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  // Initialize appliedFilters with status from URL
  const initialFilters: FilterResult = {
    options: [],
    menuOptions: searchParams.get("status")
      ? { Status: [searchParams.get("status")!] }
      : {},
    startDate: null,
    endDate: null,
  };

  const [appliedFilters, setAppliedFilters] =
    useState<FilterResult>(initialFilters);

  const isFilterApplied = useCallback(() => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  }, [appliedFilters]);

  // Mock filtering logic
  const filteredInvoices = useMemo(() => {
    let filtered = [...mockInvoices];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.client_name.toLowerCase().includes(search.toLowerCase()) ||
          invoice.payment_reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (appliedFilters.menuOptions.Status?.length > 0) {
      const statusFilter = appliedFilters.menuOptions.Status[0].toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.status.toLowerCase() === statusFilter ||
          (statusFilter === "partially_paid" &&
            invoice.status.toLowerCase() === "partially paid")
      );
    }

    // Apply property filter
    if (appliedFilters.menuOptions.Property?.length > 0) {
      filtered = filtered.filter((invoice) =>
        appliedFilters.menuOptions.Property?.includes(invoice.property_id)
      );
    }

    // Apply account officer filter
    if (appliedFilters.menuOptions["Account Officer"]?.length > 0) {
      filtered = filtered.filter((invoice) =>
        appliedFilters.menuOptions["Account Officer"]?.includes(
          invoice.account_officer_id
        )
      );
    }

    // Apply date range filter
    if (selectedDateRange?.from && selectedDateRange?.to) {
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.created_at);
        return (
          invoiceDate >= selectedDateRange.from! &&
          invoiceDate <= selectedDateRange.to!
        );
      });
    }

    return filtered;
  }, [search, appliedFilters, selectedDateRange]);

  // Update invoice data based on filters
  useEffect(() => {
    const updatedData = {
      statistics: mockInvoiceStatistics,
      invoices: filteredInvoices,
    };
    setInvoiceData(updatedData);
  }, [filteredInvoices]);

  // Effect to update timeRangeLabel
  useEffect(() => {
    const newTimeRangeLabel = (() => {
      switch (invoiceTimeRange) {
        case "90d":
          return "Last 3 months";
        case "30d":
          return "Last 30 days";
        case "7d":
          return "Last 7 days";
        case "1d":
          return "Yesterday";
        case "custom":
          if (selectedDateRange?.from && selectedDateRange?.to) {
            return `${dayjs(selectedDateRange.from).format(
              "MMM D, YYYY"
            )} - ${dayjs(selectedDateRange.to).format("MMM D, YYYY")}`;
          }
          return "Last 30 days";
        default:
          return "Last 30 days";
      }
    })();

    if (newTimeRangeLabel !== timeRangeLabel) {
      setGlobalInfoStore("timeRangeLabel", newTimeRangeLabel);
    }
  }, [invoiceTimeRange, selectedDateRange, timeRangeLabel, setGlobalInfoStore]);

  const [state, setState] = useState<{ selectedState: string }>({
    selectedState: "",
  });

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAutoGenerated, setIsAutoGenerated] = useState<boolean>(false);

  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
    setIsAutoGenerated(item.is_auto);
    // Extract the actual status string from the React element
    const statusString =
      item.status && typeof item.status === "object" && "props" in item.status
        ? item.status.props.children
        : item.status;
    setInvoiceStatus(statusString);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
    setInvoiceStatus("");
  };

  // Function to get the display label for the time range
  const getTimeRangeLabel = useCallback(() => {
    switch (invoiceTimeRange) {
      case "90d":
        return "Last 3 months";
      case "30d":
        return "Last 30 days";
      case "7d":
        return "Last 7 days";
      case "1d":
        return "Yesterday";
      case "custom":
        if (selectedDateRange?.from && selectedDateRange?.to) {
          return `${dayjs(selectedDateRange.from).format(
            "MMM D, YYYY"
          )} - ${dayjs(selectedDateRange.to).format("MMM D, YYYY")}`;
        }
        return "Last 30 days";
      default:
        return "Last 30 days"; // Fallback for any unexpected value
    }
  }, [invoiceTimeRange, selectedDateRange]);

  const statusOptions = [
    { label: "Cancel", value: "cancel" },
    { label: "Part Payment", value: "partially_paid" },
    { label: "Fully Paid", value: "paid" },
    { label: "Unpaid", value: "pending" },
  ];

  const IS_PAID =
    invoiceStatus?.toLowerCase() === "paid" ||
    invoiceStatus?.toLowerCase() === "partially paid";

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="w-full pt-4 flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Invoices</span>
          </div>
          <Button
            href="/accounting/invoice/create-invoice"
            type="button"
            className="page-header-button"
          >
            + create invoice
          </Button>
        </div>
        <div className="bg-white dark:bg-[#3C3D37] rounded-[8px] border border-opacity-20 border-[#BAC7D533] p-4 space-y-6">
          <div className="flex flex-wrap gap-y-4 items-center justify-between">
            <div
              className={`w-fit flex bg-[#F5F5F5] dark:bg-darkText-primary rounded-md items-center justify-center`}
            >
              <DatePickerWithRange
                selectedRange={selectedDateRange}
                onDateChange={() => {}}
              />
              <Select value={invoiceTimeRange} onValueChange={() => {}}>
                <SelectTrigger
                  className="md:w-full lg:w-[120px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                  <SelectItem value="1d" className="rounded-lg">
                    Yesterday
                  </SelectItem>
                  <SelectItem value="custom" className="rounded-lg">
                    Custom
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <SearchInput
                onSearch={() => {}}
                placeholder="Search for Invoice"
                className="max-w-[255px]"
              />
              <Modal>
                <ModalTrigger asChild>
                  <FilterButton />
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    filterOptionsMenu={accountingInvoiceOptionsWithDropdown}
                    handleFilterApply={() => {}}
                    isDateTrue
                    appliedFilters={appliedFilters}
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <ExportButton type="pdf" href="/accounting/invoice/export" />
                <ExportButton fileLabel="Invoice" type="csv" />
              </div>
            </div>
          </div>
          <div className="account-card-container">
            <AccountStatsCard
              className="!min-w-[320px] shrink-0"
              title="Total Paid Invoice"
              balance={mockInvoiceStatistics.percentage_change_total}
              trendDirection={
                mockInvoiceStatistics.percentage_change_paid < 0 ? "down" : "up"
              }
             otherCurrency={"₦6,000,000"}
              trendColor={
                mockInvoiceStatistics.total_paid_receipt < 0 ? "red" : "green"
              }
              variant="greenIncoming"
              percentage={mockInvoiceStatistics.percentage_change_pending}
              timeRangeLabel={getTimeRangeLabel()}
              noSymbol
            />
            <AccountStatsCard
              className="!min-w-[320px] shrink-0"
              title="Total Invoice Created"
              balance={mockInvoiceStatistics.percentage_change_total}
              trendDirection={
                mockInvoiceStatistics.percentage_change_paid < 0 ? "down" : "up"
              }
             otherCurrency={"₦2,000,000"}
              trendColor={
                mockInvoiceStatistics.total_paid_receipt < 0 ? "red" : "green"
              }
              variant="blueIncoming"
              percentage={mockInvoiceStatistics.percentage_change_pending}
              timeRangeLabel={getTimeRangeLabel()}
              noSymbol
            />
            <AccountStatsCard
              className="!min-w-[320px] shrink-0"
              title="Total Pending Invoice"
              balance={"₦100,0000"}
              trendDirection={
                mockInvoiceStatistics.percentage_change_paid < 0 ? "down" : "up"
              }
              otherCurrency={"₦2,000,000"}
              trendColor={
                mockInvoiceStatistics.total_paid_receipt < 0 ? "red" : "green"
              }
              variant="redOutgoing"
              percentage={mockInvoiceStatistics.percentage_change_pending}
              timeRangeLabel={getTimeRangeLabel()}
              noSymbol
            />
          </div>
        </div>
      </div>
      {invoiceTableData.length === 0 ? (
        search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <section>
            <EmptyList
              noButton
              title="You haven't created any invoices yet."
              body={
                <p>
                  You can either create a new invoice manually or allow the
                  system to generate an invoice automatically for a new rent.
                </p>
              }
            />
          </section>
        )
      ) : (
        <>
          {silentLoading ? (
            <TableLoading />
          ) : (
            <CustomTable
              fields={invoiceTableFields}
              data={invoiceTableData}
              tableHeadStyle={{ height: "76px" }}
              tableHeadCellSx={{ fontSize: "1rem" }}
              tableBodyCellSx={{
                fontSize: "1rem",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
              onActionClick={(item, e) => {
                handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
              }}
            />
          )}
          <TableMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <>
              {!IS_PAID && (
                <MenuItem onClick={handleMenuClose} disableRipple>
                  <Link
                    href={`/accounting/invoice/${selectedItemId}/manage`}
                    className="w-full text-left"
                  >
                    Manage
                  </Link>
                </MenuItem>
              )}
            </>
            <MenuItem onClick={handleMenuClose} disableRipple>
              <Link
                href={`/accounting/invoice/${selectedItemId}/print-invoice`}
                className="w-full text-left"
              >
                Preview
              </Link>
            </MenuItem>
          </TableMenu>
        </>
      )}
    </section>
  );
};

export default AccountingInvoicePage;
