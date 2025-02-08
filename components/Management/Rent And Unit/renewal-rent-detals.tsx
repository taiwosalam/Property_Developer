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
import { PreviousRecords } from "@/app/(nav)/management/rent-unit/data";
import { formatNumber } from "@/utils/number-formatter";
import { useOccupantStore } from "@/hooks/occupant-store";

export const RenewalRentDetails: React.FC<{
  isRental: boolean;
  startDate: string;
  dueDate: string;
  rentFee: string;
  otherFee: string;
}> = ({
  isRental,
  startDate,
  dueDate,
  rentFee,
  otherFee
}) => {
    const renewalRentDetailItems = [
      { label: "Current Start Date", value: startDate },
      { label: "Due Date", value: dueDate },
      { label: "Annual Rent", value: `₦${(rentFee ? Number(rentFee) : 0).toLocaleString()}` },
      { label: "Other Fees", value: `₦${(otherFee ? Number(otherFee) : 0).toLocaleString()}` },
    ];
    return (
      <div className="space-y-6">
        <RentSectionTitle>
          {isRental ? "Renew Rent Details" : "Fee Renewal Details"}
        </RentSectionTitle>
        <RentSectionContainer title={isRental ? "Rent Fee" : "Fee"}>
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
}> = ({ isRental, feeDetails, total_package, id }) => {
  return (
    <div className="space-y-6">
      <RentSectionTitle>Renewal Fee</RentSectionTitle>
      <FeeDetails
        title={isRental ? "Annual Rent" : "Annual Fee"}
        feeDetails={feeDetails}
        total_package={total_package}
        id={id}
      />
    </div>
  );
};

export const RenewalRent: React.FC<{
  isRental: boolean;
  rentPeriod: RentPeriod;
  title?: string;
  start?: boolean;
}> = ({ isRental, rentPeriod, title, start }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  type CheckboxOption =
    | "Create Invoice"
    | "Mobile Notification"
    | "SMS Alert"
    | "Email Alert"
    | "Rent Agreement";

  const checkboxOptions: CheckboxOption[] = [
    "Create Invoice",
    "Mobile Notification",
    "SMS Alert",
    "Email Alert",
    "Rent Agreement",
  ];

  const [checkboxStates, setCheckboxStates] = useState<
    Record<CheckboxOption, boolean>
  >({
    "Create Invoice": false,
    "Mobile Notification": true,
    "SMS Alert": true,
    "Email Alert": true,
    "Rent Agreement": true,
  });

  const handleCheckboxChange = (option: CheckboxOption) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  useEffect(() => {
    if (!startDate) {
      setDueDate(null);
      return;
    }
    setDueDate(calculateDueDate(startDate, rentPeriod));
  }, [startDate, rentPeriod]);

  return (
    <div>
      <RentSectionTitle>
        {title || (isRental ? "Renew Rent" : "Renewal Fee")}
      </RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <DateInput
          id="payment_date"
          label="Payment Date"
          value={startDate}
          onChange={setStartDate}
        />
        <DateInput
          id="due_date"
          label="Due Date"
          value={dueDate}
          disabled
          className="opacity-50"
        />
      </div>
      <div className="flex items-center justify-end gap-4 flex-wrap mb-4">
        {checkboxOptions.map((option) => (
          <Checkbox
            sm
            key={option}
            checked={checkboxStates[option]}
            onChange={() => handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </div>
      <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit ml-auto">
        {start ? (
          <>
            {checkboxStates["Create Invoice"]
              ? `Payment will be reflected once the ${isRental ? "tenant" : "occupant"
              } makes a payment towards the generated invoice.`
              : `Confirms that you have received payment for the Unit Change.  However, if you intend to receive the payment, you can click 'create invoice' for ${isRental ? "tenant" : "occupant"
              } to make the payment.`}
          </>
        ) : (
          <>
            {checkboxStates["Create Invoice"]
              ? `${isRental ? "Rent" : "Fee"} will commence upon ${isRental ? "tenant" : "occupant"
              } making payment for the generated invoice.`
              : `Confirms that you have received payment for the ${isRental ? "rent" : "fee"
              } renewal. However, if you intend to receive the payment, you can click 'create invoice' for ${isRental ? "tenant" : "occupant"
              } to make the payment.`}
          </>
        )}
      </p>
    </div>
  );
};


type UnitViewResponse = {
  previous_records: {
    data: any[]; 
    pagination: {
      current_page: number;
      total_pages: number;
    };
  };
};

type PreviousRentRecordsProps = {
  isRental: boolean;
  previous_records?: PreviousRecords;
  unit_id?: string;
};

export const PreviousRentRecords: React.FC<PreviousRentRecordsProps> = ({
  isRental,
  previous_records,
  unit_id,
}) => {
  // console.log(unit_id)
  // if (!unit_id) return null;
  const [records, setRecords] = useState<any[]>(previous_records?.data || []);
  const { setRecords: setOccupantRecords } =
    useOccupantStore();


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

  // Pass the expected response type to useFetch so that TS knows about previous_records
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
  const fetchNextPage = useCallback(
    debounce(() => {
      if (pagination.hasMore && !silentLoading) {
        setPagination((prev) => ({
          ...prev,
          current_page: prev.current_page + 1,
        }));
      }
    }, 500),
    [pagination.hasMore, silentLoading]
  );

  // Intersection Observer: attach to the last record's ref.
  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasMore) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, pagination.hasMore]
  );

  // Update records and pagination when new API data arrives.
  useEffect(() => {
    if (data && data.previous_records) {
      const newRecords = data.previous_records.data || [];
      setRecords((prevRecords) => {
        const combined = [...prevRecords, ...newRecords];
        const unique = combined.filter(
          (record, index, self) =>
            index === self.findIndex((r) => r.id === record.id)
        );
        return unique;
      });
      const newPagination = data.previous_records.pagination;
      if (newPagination) {
        setPagination((prev) => ({
          ...prev,
          current_page: newPagination.current_page,
          total_pages: newPagination.total_pages,
          hasMore: newPagination.current_page < newPagination.total_pages,
        }));
      }
    }
  }, [data]);

  const tableData = records.map((record, index) => ({
    ...record,
    amount_paid: `₦${formatNumber(record.amount_paid) || 0}`,
    start_date: record.start_date
      ? dayjs(record.start_date).format("MMM D, YYYY").toLowerCase()
      : null,
    due_date: record.due_date
      ? dayjs(record.due_date).format("MMM D, YYYY").toLowerCase()
      : null,
    payment_date: record.payment_date
      ? dayjs(record.payment_date).format("MMM D, YYYY").toLowerCase()
      : null,
    ref: index === records.length - 1 ? lastRowRef : null,
  }));

  useEffect(()=> {
    setOccupantRecords(tableData)
  },[data])

  
  if (isNetworkError) return <NetworkError />;
  if (error) return <p className="text-base text-red-500 font-medium">{error}</p>;


  console.log("redcord", tableData)
  return (
    <div className="previous-records-container">
      {loading ? (
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
      {silentLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

