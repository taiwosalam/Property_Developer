import {
  RentSectionTitle,
  RentSectionContainer,
  FeeDetails,
} from "./rent-section-container";
import { EstateDetailItem as DetailItem } from "./detail-item";
import {
  renewalRentDetailItems,
  previousRentRecordsData,
  previousRentRecordsTableFields,
  type RentPeriod,
  calculateDueDate,
  CheckBoxOptions,
} from "./data";
import type { FeeDetail } from "./types";
import { SectionSeparator } from "@/components/Section/section-components";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import DateInput from "@/components/Form/DateInput/date-input";
import CustomTable from "@/components/Table/table";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import TableLoading from "@/components/Loader/TableLoading";
// import { PreviousRecords } from "@/app/(nav)/management/rent-unit/data";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { useOccupantStore } from "@/hooks/occupant-store";
import {
  calculateOverduePeriods,
  formatOwingPeriod,
  getOwingBreakdown,
} from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

export const RenewalRentDetails: React.FC<{
  isRental: boolean;
  startDate: string;
  dueDate: string;
  rentFee: string;
  otherFee: string;
  totalPackage?: string;
}> = ({ isRental, startDate, dueDate, rentFee, otherFee, totalPackage }) => {
  const renewalRentDetailItems = [
    { label: "Start Date", value: startDate },
    { label: "Due Date", value: dueDate },
    { label: "Total", value: totalPackage },
    // { label: "Annual Rent", value: rentFee },
    // { label: "Other Fees", value: otherFee },
  ];
  return (
    <div className="space-y-6">
      <RentSectionTitle>
        {isRental ? "Current Rent" : "Current Details"}
      </RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Details" : "Fee"}>
        <div className="grid grid-cols-2 gap-4">
          {renewalRentDetailItems.map((item, index) => (
            <DetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "150px" }}
            />
          ))}
        </div>
      </RentSectionContainer>
    </div>
  );
};

export const RenewalFee: React.FC<{
  isRental: boolean;
  feeDetails: FeeDetail[];
  total_package: number;
  id: string;
  period?: string;
  currency?: Currency;
  setIsUpfrontPaymentChecked?: (checked: boolean) => void;
  isUpfrontPaymentChecked?: boolean;
  noEdit?: boolean;
  title?: string;
  outstandingBalance?: number;
  calculation?: boolean;
  deduction?: boolean;
  dueDate?: string;
  showCalculation?: boolean;
}> = ({
  isRental,
  feeDetails,
  total_package,
  id,
  period,
  currency,
  isUpfrontPaymentChecked,
  setIsUpfrontPaymentChecked,
  noEdit,
  title,
  dueDate,
  outstandingBalance = 0,
  calculation = false,
  deduction = false,
  showCalculation,
}) => {
  const currencySymbol =
    currencySymbols[currency as keyof typeof currencySymbols] || "₦";
  // Check if toggle props are provided
  const hasToggleProps =
    isUpfrontPaymentChecked !== undefined && setIsUpfrontPaymentChecked;

  // Get net owing breakdown (no overdue breakdown needed here)
  const { netOwingBreakdown } = getOwingBreakdown(
    dueDate || "", // dueDate not needed for RenewalFee
    (period as RentPeriod) || "monthly",
    total_package,
    outstandingBalance,
    total_package,
    calculation,
    deduction,
    currencySymbol
  );
  //NB:😡🤬💀💀 DO NOT ALTER THE CLASSNAME FOR PARENT DIV AS THEY'RE FOR TOUR GUIDE e.g renewal-fee-wrapper 😡🤬💀💀
  return (
    <div className="renewal-fee-wrapper space-y-6">
      {hasToggleProps ? (
        // Render with toggle (checkbox and description)
        <div className="flex gap-1 flex-col">
          <div className="flex gap-2">
            <RentSectionTitle>
              {title ? title : isRental ? "Renewal Rent" : "Renewal Fee"}
            </RentSectionTitle>
            <Checkbox
              radio
              checked={isUpfrontPaymentChecked}
              onChange={() => setIsUpfrontPaymentChecked(true)}
            />
          </div>
          <p>
            Select this option if the client wishes to make a partial advance
            payment of the total amount.
          </p>
        </div>
      ) : (
        // Render title without checkbox
        <RentSectionTitle>
          {title ? title : isRental ? "Renewal Rent" : "Renewal Fee"}
        </RentSectionTitle>
      )}

      {(!hasToggleProps || isUpfrontPaymentChecked) && (
        <>
          <FeeDetails
            title={isRental ? "Breakdown" : "Annual Fee"}
            feeDetails={feeDetails}
            total_package={total_package}
            id={id}
            currency={currency}
            noEdit={noEdit}
          />
        </>
      )}
    </div>
  );
};

// =============== OWING FEE COMPONENT ===============
export const OwingFee: React.FC<{
  isRental: boolean;
  feeDetails: FeeDetail[];
  total_package: number;
  id: string;
  period?: string;
  dueDate?: string;
  currency: Currency;
  isUpfrontPaymentChecked?: boolean;
  outstandingBalance?: number;
  noCalculation?: boolean;
  calculation?: boolean;
  deduction?: boolean;
}> = ({
  isRental,
  feeDetails,
  total_package,
  id,
  period,
  dueDate,
  currency,
  isUpfrontPaymentChecked,
  outstandingBalance = 0,
  calculation = false,
  deduction = false,
  noCalculation,
}) => {
  const [owingAmount, setOwingAmount] = useState<number>(0);
  const [overduePeriods, setOverduePeriods] = useState<number>(0);
  const currencySymbol =
    currencySymbols[currency as keyof typeof currencySymbols] || "₦";
  // Calculate owing amount when dueDate, period, or totalPackage changes
  useEffect(() => {
    if (dueDate && period && total_package) {
      const overduePeriods = calculateOverduePeriods(
        dueDate,
        period as RentPeriod
      );
      const calculatedOwing = overduePeriods * total_package;
      setOwingAmount(calculatedOwing);
      const periods = calculateOverduePeriods(dueDate, period as RentPeriod);
      setOverduePeriods(periods);
    }
  }, [dueDate, period, total_package]);

  // If no owing amount or toggle is off, don't render
  if (owingAmount <= 0 || !isUpfrontPaymentChecked) {
    return null;
  }

  // Combine original fee details with the calculated owing amount
  const updatedFeeDetails: FeeDetail[] = [
    ...feeDetails,
    {
      name: "Owing Period",
      amount: formatOwingPeriod(overduePeriods, period as RentPeriod),
    },
    {
      name: "Owing Amount",
      amount: owingAmount
        ? `${
            currencySymbols[currency as keyof typeof currencySymbols] ?? "₦"
          }${formatNumber(Number(owingAmount))}`
        : "",
    },
    { name: "Rent Penalty", amount: "--- ---" },
  ];

  // Get breakdowns
  const { overdueBreakdown, netOwingBreakdown } = getOwingBreakdown(
    dueDate || "",
    period as RentPeriod,
    total_package,
    outstandingBalance,
    total_package,
    calculation,
    deduction,
    currencySymbol
  );

  // Update total package cost to include owing amount
  const updatedTotalPackage = total_package + owingAmount;
  return (
    <div className="space-y-6">
      <RentSectionTitle>Oustanding Details</RentSectionTitle>
      <FeeDetails
        owing
        noEdit
        currency={currency}
        title={isRental ? "Breakdown" : "Breakdown"}
        feeDetails={updatedFeeDetails}
        total_package={updatedTotalPackage}
        id={id}
      />
      {!noCalculation && (
        <div className="space-y-2">
          <p className="text-[#747474] dark:text-white text-base font-normal">
            Net Owing Calculation
          </p>
          <div className="space-y-2">
            {netOwingBreakdown.map((item, index) => (
              <div key={index} className="flex items-start">
                <p className="text-[#747474] dark:text-white w-[150px] capitalize">
                  {item.label}
                </p>
                <p className="text-black dark:text-darkText-2 capitalize">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ================== RENEWAL RENT COMPONENT ===============
export const RenewalRent: React.FC<{
  isRental: boolean;
  rentPeriod: RentPeriod;
  due_date?: Dayjs | null;
  title?: string;
  start?: boolean;
  unitData?: any;
  allowStartDateInput?: boolean;
  setStart_Date?: (date: string | null) => void;
  setDueDate?: (date: Dayjs | null) => void;
  setSelectedCheckboxOptions?: (options: CheckBoxOptions) => void;
  occupant?: { userTag?: string };
  isUpfrontPaymentChecked?: boolean;
}> = ({
  isRental,
  rentPeriod,
  due_date,
  title,
  start,
  setStart_Date,
  allowStartDateInput = true,
  setDueDate,
  setSelectedCheckboxOptions,
  occupant,
  isUpfrontPaymentChecked,
  unitData
}) => {
  const isWebUser = occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = occupant?.userTag?.toLowerCase() === "mobile";
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setLocalDueDate] = useState<Dayjs | null>(null);
  const nonNaira = unitData?.currency !== "naira";
  type CheckboxOption =
    | "Create Invoice"
    | "Mobile Notification"
    | "SMS Alert"
    | "Email Alert"
    | "Rent Agreement";

  // Checkbox options
  const checkboxOptions = [
    { label: "Create Invoice", key: "create_invoice" },
    // { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    // { label: "Email Alert", key: "email_alert" },
    { label: "Rent Agreement", key: "rent_agreement" },
  ];

  // Initialize checkbox states
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(
    {
      create_invoice: true,
      mobile_notification: true,
      sms_alert: true,
      email_alert: true,
      rent_agreement: false,
    }
  );

  // Filter checkbox options to hide Create Invoice and Mobile Notification for web users
  const visibleCheckboxOptions = isWebUser
    ? checkboxOptions.filter(
        (option) =>
          option.key !== "create_invoice" &&
          option.key !== "mobile_notification"
      )
    : checkboxOptions;

  // Update checkbox states based on userTag
  useEffect(() => {
    setCheckboxStates((prev) => ({
      ...prev,
      mobile_notification: isWebUser
        ? false
        : isMobileUser
        ? true
        : prev.mobile_notification,
      create_invoice: isMobileUser ? true : true,
    }));
  }, [isWebUser, isMobileUser]);

  // Update parent with checkbox changes
  useEffect(() => {
    setSelectedCheckboxOptions?.({
      create_invoice: checkboxStates.create_invoice,
      mobile_notification: checkboxStates.mobile_notification,
      sms_alert: checkboxStates.sms_alert,
      email_alert: checkboxStates.email_alert,
      rent_agreement: checkboxStates.rent_agreement,
    });
  }, [checkboxStates, setSelectedCheckboxOptions]);

  // Handle checkbox changes with restrictions
  const handleCheckboxChange = (optionKey: string) => (checked: boolean) => {
    if (optionKey === "mobile_notification" && isWebUser) {
      return; // Prevent changes for web users
    }
    if (optionKey === "create_invoice" && !isMobileUser) {
      return; // Prevent changes for non-mobile users
    }
    setCheckboxStates((prev) => ({
      ...prev,
      [optionKey]: checked,
    }));
  };
  // Set startDate based on expiryDate when allowStartDateInput is false
  useEffect(() => {
    if (!allowStartDateInput && due_date) {
      setStartDate(due_date);
      if (setStart_Date) {
        setStart_Date(due_date.format("YYYY-MM-DD"));
      }
    }
  }, [allowStartDateInput, due_date, setStart_Date]);

  // Calculate due_date based on startDate or due_date
  useEffect(() => {
    const effectiveStartDate = allowStartDateInput ? startDate : due_date;
    if (!effectiveStartDate) {
      setLocalDueDate(null);
      setDueDate?.(null);
      return;
    }

    const calculatedDueDate: Dayjs = calculateDueDate(
      effectiveStartDate,
      rentPeriod
    );
    setLocalDueDate(calculatedDueDate);
    setDueDate?.(calculatedDueDate);
  }, [startDate, due_date, rentPeriod, allowStartDateInput, setDueDate]);

  const handleStartDate = (date: Dayjs | null) => {
    setStartDate(date);
    if (setStart_Date) {
      setStart_Date(date?.format("YYYY-MM-DD") || null);
    }
  };

  return (
    <div className="start-new-unit-rent-wrapper">
      {allowStartDateInput && (
        <>
          <RentSectionTitle>
            {title || (isRental ? "Renew Rent" : "Renewal Fee")}
          </RentSectionTitle>
          <SectionSeparator className="mt-4 mb-6" />
        </>
      )}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {allowStartDateInput && (
          <>
            <DateInput
              id="payment_date"
              label="Payment Date"
              // disablePast
              lastYear
              value={startDate}
              onChange={handleStartDate}
            />
            <DateInput
              id="due_date"
              label="Due Date"
              value={dueDate}
              disabled
              className="opacity-50"
            />
          </>
        )}
      </div>
      {isUpfrontPaymentChecked && (
        <div className="flex items-center justify-start gap-4 flex-wrap mb-4">
          {visibleCheckboxOptions.map(({ label, key }) => (
            <Checkbox
              sm
              key={key}
              checked={checkboxStates[key]}
              onChange={handleCheckboxChange(key)}
              disabled={
                (key === "mobile_notification" && isWebUser) ||
                (key === "create_invoice" && !isMobileUser)
              }
            >
              {label}
            </Checkbox>
          ))}

          {startDate?.isBefore(dayjs(), "day") ? (
            <div className="custom-flex-col gap-1">
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                <span className="text-red-500 text-lg">*</span>
                You have selected a past date for the occupant, which indicates
                that you are recording an outstanding rent balance for the
                client, not initiating a new rent payment.
              </p>
              {nonNaira && (
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  <span className="text-red-500 text-lg">*</span>
                  The property was listed in a currency other than Naira. You
                  will need to handle all payments manually.
                </p>
              )}
            </div>
          ) : isWebUser ? (
            <div className="custom-flex-col gap-1">
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                <span className="text-red-500 text-lg">*</span>{" "}
                {`Confirms that you have received payment for the 
          ${isRental ? "rent" : "management"}.`}
              </p>
              {nonNaira && (
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  <span className="text-red-500 text-lg">*</span>
                  The property was listed in a currency other than Naira. You
                  will need to handle all payments manually.
                </p>
              )}
            </div>
          ) : (
            <div className="custom-flex-col gap-1">
              <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                <span className="text-red-500 text-lg">*</span>
                {checkboxStates["create_invoice"]
                  ? `Payment will be reflected once the ${
                      isRental ? "tenant" : "occupant"
                    } makes a payment towards the generated invoice. If you've already received the payment manually, you can uncheck 'Create Invoice' to reflect the rent immediately.`
                  : `Confirms that you have received payment for the ${
                      isRental ? "rent" : "counting"
                    }. ${
                      unitData?.currency === "naira"
                        ? ` However, if you intend to receive the payment, you can click 'Create Invoice' for ${
                            isRental ? "tenant" : "occupant"
                          } to make the payment.`
                        : ""
                    }`}
              </p>
              {nonNaira && (
                <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
                  <span className="text-red-500 text-lg">*</span>
                  The property was listed in a currency other than Naira. As a
                  result, automatic payments and wallet transactions are not
                  supported. You will need to handle all payments manually.
                </p>
              )}
            </div>
          )}

          {/* {!isWebUser && (
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              {start ? (
                <>
                  {checkboxStates.create_invoice
                    ? `Payment will be reflected once the ${
                        isRental ? "tenant" : "occupant"
                      } makes a payment towards the generated invoice.`
                    : `Confirms that you have received payment for the Unit Change. However, if you intend to receive the payment, you can click 'create invoice' for ${
                        isRental ? "tenant" : "occupant"
                      } to make the payment.`}
                </>
              ) : (
                <>
                  {checkboxStates.create_invoice
                    ? `${isRental ? "Rent" : "Fee"} will commence upon ${
                        isRental ? "tenant" : "occupant"
                      } making payment for the generated invoice.`
                    : `Confirms that you have received payment for the ${
                        isRental ? "rent" : "fee"
                      } renewal. However, if you intend to receive the payment, you can click 'create invoice' for ${
                        isRental ? "tenant" : "occupant"
                      } to make the payment.`}
                </>
              )}
            </p>
          )} */}
        </div>
      )}
    </div>
  );
};

type UnitViewResponse = {
  data: {
    current_records: {
      data: any[];
      pagination: {
        current_page: number;
        total_pages: number;
      };
    };
  };
};

type PreviousRecords = {
  data: any[];
  pagination: {
    current_page: number;
    total_pages: number;
  };
};

type PreviousRentRecordsProps = {
  isRental: boolean;
  current_records?: PreviousRecords;
  unit_id?: string;
  noRefetch?: boolean;
  currency?: Currency;
  page?: string;
};

export const PreviousRentRecords: React.FC<PreviousRentRecordsProps> = ({
  isRental,
  current_records,
  unit_id,
  noRefetch = false,
  currency,
  page,
}) => {
  // console.log("current_records", current_records);
  // Initialize records state from props
  // const [records, setRecords] = useState<any[]>(current_records?.data || []);
  const [records, setRecords] = useState<any[]>(
    page === "edit-rent"
      ? current_records?.data
        ? [...current_records.data].reverse()
        : []
      : current_records?.data || []
  );
  const { setRecords: setOccupantRecords } = useOccupantStore();

  // Set up pagination state using provided pagination info if any
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    hasMore: boolean;
  }>({
    current_page: current_records?.pagination?.current_page || 1,
    total_pages: current_records?.pagination?.total_pages || 1,
    hasMore:
      (current_records?.pagination?.current_page || 1) <
      (current_records?.pagination?.total_pages || 1),
  });

  const observer = useRef<IntersectionObserver | null>(null);

  // Memoize the fetch options so they don’t change on every render.
  const fetchOptions = useMemo(
    () => ({
      params: { page: pagination.current_page },
    }),
    [pagination.current_page]
  );

  // Always call useFetch, but we ignore its results if noRefetch is true.
  const { data, loading, silentLoading, error, isNetworkError, refetch } =
    useFetch<UnitViewResponse>(`/unit/${unit_id}/view`, fetchOptions);
  useRefetchOnEvent("refech-unit", () => refetch({ silent: true }));

  // Helper: debounce function to limit rapid calls.
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // When there are more pages and not silently loading, increment the current page.
  // Only trigger refetch if noRefetch is false.
  const fetchNextPage = useCallback(
    debounce(() => {
      if (!noRefetch && pagination.hasMore && !silentLoading) {
        setPagination((prev) => ({
          ...prev,
          current_page: prev.current_page + 1,
        }));
      }
    }, 500),
    [noRefetch, pagination.hasMore, silentLoading]
  );

  // Intersection Observer: attach to the last record's ref.
  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (noRefetch) return; // Do nothing if refetching is disabled.
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasMore) {
          fetchNextPage();
          console.log("fetching next page");
        }
      });
      if (node) observer.current.observe(node);
    },
    [noRefetch, fetchNextPage, pagination.hasMore]
  );

  // Update records and pagination when new API data arrives.
  // Only update if noRefetch is false.
  useEffect(() => {
    if (!noRefetch && data && data.data.current_records) {
      const newRecords = data.data.current_records.data || [];
      setRecords((prevRecords) => {
        const combined = [...prevRecords, ...newRecords];
        const unique = combined.filter(
          (record, index, self) =>
            index === self.findIndex((r) => r.id === record.id)
        );
        // Reverse the records if page === 'edit-rent'
        return page === "edit-rent" ? unique.reverse() : unique;
      });
      const newPagination = data.data.current_records.pagination;
      if (newPagination) {
        setPagination((prev) => ({
          ...prev,
          current_page: newPagination.current_page,
          total_pages: newPagination.total_pages,
          hasMore: newPagination.current_page < newPagination.total_pages,
        }));
      }
    }
  }, [data, noRefetch]);

  const CURRENCY =
    currencySymbols[currency as keyof typeof currencySymbols] ||
    currencySymbols["naira"];

  // Map records to tableData with formatted fields.
  const tableData = records.map((record, index) => ({
    ...record,
    amount_paid: `${CURRENCY} ${formatNumber(record.amount_paid) || 0}`,
    rent_amount: `${CURRENCY} ${formatNumber(record.rent_amount) || 0}`,
    start_date: record.start_date ? record.start_date : null,
    due_date: record.due_date
      ? record.due_date
      : // ? dayjs(record.due_date).format("MMM D, YYYY").toLowerCase()
        null,
    payment_date: record.payment_date
      ? record.payment_date
      : // ? dayjs(record.payment_date).format("MMM D, YYYY").toLowerCase()
        null,
    // Only attach ref if refetching is enabled
    ref: !noRefetch && index === records.length - 1 ? lastRowRef : null,
  }));

  // Update occupant records whenever tableData changes.
  useEffect(() => {
    setOccupantRecords(tableData);
  }, [data]);

  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  //NB:😡🤬💀💀 DO NOT ALTER THE CLASSNAME FOR PARENT DIV AS THEY'RE FOR TOUR GUIDE e.g previous-records-container 😡🤬💀💀

  return (
    <div className="previous-records-container">
      {loading && !noRefetch ? (
        <TableLoading length={10} />
      ) : (
        <div>
          <RentSectionTitle>
            {isRental ? "Previous Rent Records" : "Previous Fee Records"}
          </RentSectionTitle>
          <SectionSeparator className="mt-4 mb-6 h-[2px]" />
          <CustomTable
            data={tableData}
            fields={previousRentRecordsTableFields}
            tableHeadCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
          />
        </div>
      )}
      {silentLoading && !noRefetch && (
        <div className="flex items-center justify-center py-4">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
