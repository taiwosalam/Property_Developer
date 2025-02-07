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
import { Dayjs } from "dayjs";
import { useState, useEffect, useRef, useCallback } from "react";
import useFetch from "@/hooks/useFetch";

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

// export const PreviousRentRecords: React.FC<{ isRental: boolean, previous_records: any, unit_id: string }> = ({
//   isRental,
//   previous_records,
//   unit_id,
// }) => {
//   console.log("previous records", previous_records)
//   return (
//     <div>
//       <RentSectionTitle>
//         {isRental ? "Previous Rent Records" : "Previous Fee Records"}
//       </RentSectionTitle>
//       <SectionSeparator className="mt-4 mb-6 h-[2px]" />
//       <CustomTable
//         data={previousRentRecordsData}
//         fields={previousRentRecordsTableFields}
//         tableHeadCellSx={{
//           fontSize: "1rem",
//           paddingTop: "18px",
//           paddingBottom: "18px",
//         }}
//         tableBodyCellSx={{
//           fontSize: "1rem",
//           paddingTop: "18px",
//           paddingBottom: "18px",
//         }}
//       />
//     </div>
//   );
// };



type PreviousRentRecordsProps = {
  isRental: boolean;
  previous_records?: any;
  unit_id?: string;
};

export const PreviousRentRecords: React.FC<PreviousRentRecordsProps> = ({
  isRental,
  previous_records,
  unit_id,
}) => {
  const [records, setRecords] = useState(previous_records.data || []);
  const [state, setState] = useState({
    current_page: previous_records.pagination?.current_page || 1,
    total_pages: previous_records.pagination?.total_pages || 1,
    hasMore: previous_records.pagination?.current_page < previous_records.pagination?.total_pages,
  });
  const observer = useRef<IntersectionObserver | null>(null);
  
  const { data, loading, silentLoading } = useFetch(`unit/${unit_id}/view`, {
    params: { page: state.current_page },
  });

  // const fetchNextPage = useCallback(() => {
  //   if (state.hasMore && !silentLoading) {
  //     setState((prev) => ({
  //       ...prev,
  //       current_page: prev.current_page + 1,
  //     }));
  //   }
  // }, [state.hasMore, silentLoading]);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  
  const fetchNextPage = useCallback(
    debounce(() => {
      if (state.hasMore && !silentLoading) {
        setState((prev) => ({
          ...prev,
          current_page: prev.current_page + 1,
        }));
      }
    }, 500), // 500ms delay to avoid excessive requests
    [state.hasMore, silentLoading]
  );
  

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, state.hasMore]
  );

  
  // useEffect(() => {
  //   if (data) {
  //     setRecords((prevRecords:any) => {
  //       const newRecords = data.previous_records.data || [];
  //       const combinedRecords = [...prevRecords, ...newRecords];
  //       const uniqueRecords = combinedRecords.filter(
  //         (record, index, self) =>
  //           index === self.findIndex((r) => r.id === record.id)
  //       );
  //       return uniqueRecords;
  //     });
  //     setState((prevState) => ({
  //       ...prevState,
  //       total_pages: data.previous_records.pagination.total_pages,
  //       hasMore: data.previous_records.pagination.current_page < data.previous_records.pagination.total_pages,
  //     }));
  //   }
  // }, [data]);

  console.log("records", data)
  return (
    <div>
      <RentSectionTitle>
        {isRental ? "Previous Rent Records" : "Previous Fee Records"}
      </RentSectionTitle>
      <SectionSeparator className="mt-4 mb-6 h-[2px]" />
      <CustomTable
        data={records}
        fields={previousRentRecordsTableFields}
        tableHeadCellSx={{ fontSize: "1rem", paddingTop: "18px", paddingBottom: "18px" }}
        tableBodyCellSx={{ fontSize: "1rem", paddingTop: "18px", paddingBottom: "18px" }}
      />
      {/* <div ref={lastRowRef} style={{ height: 1 }} /> */}
    </div>
  );
};
