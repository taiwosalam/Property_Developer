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
} from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";

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
        {isRental ? "Current Rent" : "Fee Renewal Details"}
      </RentSectionTitle>
      <RentSectionContainer title={isRental ? "Rent Details" : "Fee"}>
        <div className="grid md:grid-cols-2 gap-4">
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
}> = ({
  isRental,
  feeDetails,
  total_package,
  id,
  period,
  currency,
  isUpfrontPaymentChecked,
  setIsUpfrontPaymentChecked,
}) => {
  return (
    <div className="space-y-6">
        <div className="flex gap-1 flex-col">
        <div className="flex gap-2">
          <RentSectionTitle>Renewal Rent</RentSectionTitle>
          <Checkbox
            radio
            checked={!isUpfrontPaymentChecked}
            onChange={() =>
              setIsUpfrontPaymentChecked && setIsUpfrontPaymentChecked(false)
            }
          />
        </div>
        <p>
          Select this option if the client wishes to make a partial advance
          payment of the total amount.
        </p>
      </div>
      {/* <RentSectionTitle>Renewal Rent</RentSectionTitle> */}
      {!isUpfrontPaymentChecked && (
      <FeeDetails
        title={isRental ? "Renewal Details" : "Annual Fee"}
        feeDetails={feeDetails}
        total_package={total_package}
        id={id}
        currency={currency}
      />
      )}
    </div>
  );
};

export const OwingFee: React.FC<{
  isRental: boolean;
  feeDetails: FeeDetail[];
  total_package: number;
  id: string;
  period?: string;
  dueDate?: string;
  currency: Currency;
}> = ({
  isRental,
  feeDetails,
  total_package,
  id,
  period,
  dueDate,
  currency,
}) => {
  const [owingAmount, setOwingAmount] = useState<number>(0);
  const [overduePeriods, setOverduePeriods] = useState<number>(0);
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
    </div>
  );
};

export const RenewalRent: React.FC<{
  isRental: boolean;
  rentPeriod: RentPeriod;
  due_date?: Dayjs | null;
  title?: string;
  start?: boolean;
  allowStartDateInput?: boolean;
  setStart_Date?: (date: string | null) => void;
  setDueDate?: (date: Dayjs | null) => void;
  setSelectedCheckboxOptions?: (options: CheckBoxOptions) => void;
  occupant?: { userTag?: string };
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
}) => {
  const isWebUser = occupant?.userTag?.toLowerCase() === "web";
  const isMobileUser = occupant?.userTag?.toLowerCase() === "mobile";
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setLocalDueDate] = useState<Dayjs | null>(null);

  type CheckboxOption =
    | "Create Invoice"
    | "Mobile Notification"
    | "SMS Alert"
    | "Email Alert"
    | "Rent Agreement";

  // const checkboxOptions: CheckboxOption[] = [
  //   "Create Invoice",
  //   "Mobile Notification",
  //   "SMS Alert",
  //   "Email Alert",
  //   "Rent Agreement",
  // ];

  // Checkbox options
  const checkboxOptions = [
    { label: "Create Invoice", key: "create_invoice" },
    { label: "Mobile Notification", key: "mobile_notification" },
    { label: "SMS Alert", key: "sms_alert" },
    { label: "Email Alert", key: "email_alert" },
    { label: "Rent Agreement", key: "rent_agreement" },
  ];

  // Initialize checkbox states
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(
    {
      create_invoice: true,
      mobile_notification: true,
      sms_alert: true,
      email_alert: true,
      rent_agreement: true,
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

  // const [checkboxStates, setCheckboxStates] = useState<
  //   Record<CheckboxOption, boolean>
  // >({
  //   "Create Invoice": true,
  //   "Mobile Notification": true,
  //   "SMS Alert": true,
  //   "Email Alert": true,
  //   "Rent Agreement": true,
  // });

  // // Update parent with checkbox changes
  // useEffect(() => {
  //   setSelectedCheckboxOptions?.({
  //     create_invoice: checkboxStates["Create Invoice"],
  //     mobile_notification: checkboxStates["Mobile Notification"],
  //     sms_alert: checkboxStates["SMS Alert"],
  //     email_alert: checkboxStates["Email Alert"],
  //     rent_agreement: checkboxStates["Rent Agreement"],
  //   });
  // }, [checkboxStates, setSelectedCheckboxOptions]);

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
    <div>
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
              disablePast
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
      <div className="flex items-center justify-end gap-4 flex-wrap mb-4">
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
      </div>
      {!isWebUser && (
        <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit ml-auto">
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
      )}
    </div>
  );
};

type UnitViewResponse = {
  data: {
    previous_records: {
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
  previous_records?: PreviousRecords;
  unit_id?: string;
  noRefetch?: boolean;
  currency?: Currency;
};

export const PreviousRentRecords: React.FC<PreviousRentRecordsProps> = ({
  isRental,
  previous_records,
  unit_id,
  noRefetch = false,
  currency,
}) => {
  // console.log(unit_id);
  // Initialize records state from props
  const [records, setRecords] = useState<any[]>(previous_records?.data || []);
  const { setRecords: setOccupantRecords } = useOccupantStore();

  // Set up pagination state using provided pagination info if any
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    hasMore: boolean;
  }>({
    current_page: previous_records?.pagination?.current_page || 1,
    total_pages: previous_records?.pagination?.total_pages || 1,
    hasMore:
      (previous_records?.pagination?.current_page || 1) <
      (previous_records?.pagination?.total_pages || 1),
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
  const { data, loading, silentLoading, error, isNetworkError } =
    useFetch<UnitViewResponse>(`/unit/${unit_id}/view`, fetchOptions);

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
    if (!noRefetch && data && data.data.previous_records) {
      const newRecords = data.data.previous_records.data || [];
      setRecords((prevRecords) => {
        const combined = [...prevRecords, ...newRecords];
        const unique = combined.filter(
          (record, index, self) =>
            index === self.findIndex((r) => r.id === record.id)
        );
        return unique;
      });
      const newPagination = data.data.previous_records.pagination;
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
    start_date: record.start_date
      ? dayjs(record.start_date).format("MMM D, YYYY").toLowerCase()
      : null,
    due_date: record.due_date
      ? dayjs(record.due_date).format("MMM D, YYYY").toLowerCase()
      : null,
    payment_date: record.payment_date
      ? dayjs(record.payment_date).format("MMM D, YYYY").toLowerCase()
      : null,
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
