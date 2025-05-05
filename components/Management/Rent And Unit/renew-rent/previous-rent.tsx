import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { RentSectionTitle } from "../rent-section-container";
import { SectionSeparator } from "@/components/Section/section-components";
import CustomTable from "@/components/Table/table";
import TableLoading from "@/components/Loader/TableLoading";
import NetworkError from "@/components/Error/NetworkError";
import { previousRentRecordsTableFields } from "../data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { useOccupantStore } from "@/hooks/occupant-store";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";
import { useRenewRentContext } from "@/utils/renew-rent-context";

interface RentRecord {
  id: string;
  amount_paid: number;
  start_date: string;
  due_date: string;
  payment_date: string;
  [key: string]: any;
}

interface PreviousRecords {
  data: RentRecord[];
  pagination: {
    current_page: number;
    total_pages: number;
  };
}

interface UnitViewResponse {
  data: {
    previous_records: PreviousRecords;
  };
}

const PreviousRentRecords = () => {
  const { isRental, unitData, currency } = useRenewRentContext();
  const { setRecords: setOccupantRecords } = useOccupantStore();

  // TODO: Revisit to fix type mismatch (unitData.previous_records should be PreviousRecords, not PreviousRecords[])
  // Using any to bypass TypeScript errors temporarily
  const previousRecords: any = unitData.previous_records;

  // Initialize records and pagination
  const [records, setRecords] = useState<RentRecord[]>(
    previousRecords?.data || []
  );
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    hasMore: boolean;
  }>({
    current_page: previousRecords?.pagination?.current_page || 1,
    total_pages: previousRecords?.pagination?.total_pages || 1,
    hasMore:
      (previousRecords?.pagination?.current_page || 1) <
      (previousRecords?.pagination?.total_pages || 1),
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const fetchOptions = useMemo(
    () => ({ params: { page: pagination.current_page } }),
    [pagination.current_page]
  );

  const { data, loading, silentLoading, error, isNetworkError } =
    useFetch<UnitViewResponse>(
      unitData.unit_id ? `/unit/${unitData.unit_id}/view` : null,
      fetchOptions
    );

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

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

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !silentLoading) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, pagination.hasMore, silentLoading]
  );

  useEffect(() => {
    if (data?.data.previous_records) {
      const newRecords = data.data.previous_records.data || [];
      setRecords((prevRecords) => {
        const combined = [...prevRecords, ...newRecords];
        // Remove duplicates based on id
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
  }, [data]);

  const tableData = useMemo(
    () =>
      records.map((record, index) => ({
        ...record,
        amount_paid: `${
          currencySymbols[currency as keyof typeof currencySymbols] || "₦"
        } ${formatNumber(record.amount_paid) || 0}`,
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
      })),
    [records, currency, lastRowRef]
  );

  useEffect(() => {
    setOccupantRecords(tableData);
  }, [tableData, setOccupantRecords]);

  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="previous-records-container">
      {loading && records.length === 0 ? (
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

export default PreviousRentRecords;
