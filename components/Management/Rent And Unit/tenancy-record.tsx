"use client";
import clsx from "clsx";
import { ThichDownArrow } from "@/public/icons/icons";
import { SectionSeparator } from "@/components/Section/section-components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { motion, AnimatePresence } from "framer-motion";
import { DetailItem } from "../detail-item";
import Picture from "@/components/Picture/picture";
import CustomTable from "@/components/Table/table";
import { LandlordTenantInfoDocument } from "../landlord-tenant-info-components";
import {
  previousRentRecordsTableFields as tableFields,
  previousRentRecordsData as tableData,
  debounce,
  transformDocuments,
} from "./data";
import { groupDocumentsByType } from "@/utils/group-documents";
import { empty } from "@/app/config";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import useFetch from "@/hooks/useFetch";
import { TenancyRecordProps } from "./types";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import TableLoading from "@/components/Loader/TableLoading";

const TenancyRecord = ({
  name,
  period,
  email,
  phone,
  picture,
  renew_rent,
  renew_total_package,
  renewalPackage,
  tenant,
  unit_id,
  documents, // Use documents prop instead of unit_documents
  currency,
  index,
  move_in,
  move_out,
}: {
  unit_id?: string;
  name?: string;
  move_in?: string;
  move_out?: string;
  period?: string;
  email?: string;
  picture?: string;
  phone?: string;
  renew_rent?: string;
  renew_total_package?: string;
  renewalPackage?: string;
  tenant?: any;
  documents?: any[]; // Updated to include documents prop
  currency?: Currency;
  index?: number;
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const transformedDocs = transformDocuments(documents || []); // Use documents instead of unit_documents
  const groupedDocuments = groupDocumentsByType(transformedDocs);
  const CURRENCY =
    currencySymbols[currency as keyof typeof currencySymbols] ||
    currencySymbols["naira"];

  // Initialize records and pagination from the tenant prop
  const [records, setRecords] = useState<any[]>(tenant?.rents || []);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    hasMore: boolean;
  }>({
    current_page: tenant?.pagination?.current_page || 1,
    total_pages: tenant?.pagination?.total_pages || 1,
    hasMore:
      (tenant?.pagination?.current_page || 1) <
      (tenant?.pagination?.total_pages || 1),
  });

  const observer = useRef<IntersectionObserver | null>(null);

  // Memoize fetch options so that the fetch hook only re-runs when page changes
  const fetchOptions = useMemo(
    () => ({
      params: { page: pagination.current_page },
    }),
    [pagination.current_page]
  );

  const { data, loading, silentLoading, error, isNetworkError } = useFetch<{
    data: { previous_records: { data: any[]; pagination: any } };
  }>(`/unit/${unit_id}/view`, fetchOptions);

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

  // Attach an IntersectionObserver to the last row so that scrolling to it triggers fetching next page
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

  // When new API data arrives, update records and pagination
  useEffect(() => {
    if (data && data.data?.previous_records) {
      const newRecords = data.data.previous_records.data || [];
      setRecords((prevRecords) => {
        const combined = [...prevRecords, ...newRecords];
        return combined.filter(
          (record, index, self) =>
            index === self.findIndex((r) => r.id === record.id)
        );
      });
      const newPagination = data.data.previous_records.pagination;
      if (newPagination) {
        setPagination({
          current_page: newPagination.current_page,
          total_pages: newPagination.total_pages,
          hasMore: newPagination.current_page < newPagination.total_pages,
        });
      }
    }
  }, [data]);

  // Map records to tableData ensuring keys match tableFields accessors.
  const tableData = records.map((record, index) => ({
    "S/N": index + 1,
    payment_date: record.payment_date
      ? record.payment_date
      : "",
    amount_paid: record.amount_paid
      ? `${CURRENCY} ${formatNumber(record.amount_paid)}`
      : "",
    rent_amount: record.rent_amount
      ? `${CURRENCY} ${formatNumber(record.rent_amount)}`
      : "",
    details: record.details || "",
    start_date: record.start_date
      ? record.start_date
      : "",
    due_date: record.due_date
      ? record.due_date
      : "",
    // Attach a ref for the last row to trigger pagination (if more pages exist)
    ref: index === records.length - 1 && pagination.hasMore ? lastRowRef : null,
  }));

  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div
      className="bg-white dark:bg-darkText-primary p-6 space-y-4 rounded-2xl"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <p className="text-base font-bold text-brand-10">( {index} ) </p>
          <h3 className="text-base font-bold text-brand-10">Tenancy Record</h3>
        </div>
        <button
          type="button"
          className="rounded bg-brand-9 py-2 px-8"
          onClick={() => {
            setIsCollapsibleOpen((x) => !x);
          }}
        >
          <div
            className={clsx("transition-transform duration-300", {
              "rotate-180": isCollapsibleOpen,
            })}
          >
            <ThichDownArrow />
          </div>
        </button>
      </div>
      <SectionSeparator className="h-[2px]" />
      <div className="flex items-center gap-4 py-4 justify-between overflow-auto custom-round-scrollbar">
        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          <DetailItem
            label="Name"
            value={
              <span className="flex items-center">
                {name}
                {/* <BadgeIcon color="yellow" /> */}
              </span>
            }
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Email"
            value={email}
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Renewal Rent"
            value={
              renew_rent
                ? `${
                    currencySymbols[currency as keyof typeof currencySymbols] ||
                    "₦"
                  }${formatNumber(parseFloat(renew_rent))}`
                : undefined
            }
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Phone Number"
            value={phone}
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Move In"
            value={dayjs(move_in).format("MMM DD YYYY")}
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Move Out"
            value={dayjs(move_out).format("MMM DD YYYY")}
            style={{ width: "130px" }}
          />
        </div>
        <Picture
          containerClassName="flex-shrink-0 custom-secondary-bg rounded-md"
          className="rounded-[12px]"
          src={picture || empty}
          size={168}
          width={100}
          height={100}
          alt="tenant name"
        />
      </div>
      <AnimatePresence initial={false}>
        {isCollapsibleOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <h4 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
                Statement
              </h4>
              {loading ? (
                <TableLoading length={10} />
              ) : (
                <CustomTable
                  fields={tableFields}
                  data={tableData}
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
              )}
              {silentLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="loader" />
                </div>
              )}
            </div>
            {/* SHARED DOCUMENTS */}
            <div className="space-y-4">
              <h4 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
                Shared Documents
              </h4>
              {Object.keys(groupedDocuments).length === 0 ? (
                <p className="text-center text-gray-500 text-md py-4">
                  No documents available for this tenant
                </p>
              ) : (
                <>
                  {Object.entries(groupedDocuments).map(
                    ([documentType, documents]) => {
                      if (documentType === "others") return null; // Skip "other document" for now
                      return (
                        <div key={documentType} className="space-y-[6px]">
                          <h6 className="text-text-secondary text-base font-medium capitalize">
                            {documentType} Documents
                          </h6>
                          <div className="flex flex-wrap gap-4">
                            {documents?.map((document) => (
                              <LandlordTenantInfoDocument
                                key={document.id}
                                {...document}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                  {groupedDocuments?.["others"] && (
                    <div className="space-y-[6px]">
                      <h6 className="text-text-secondary text-base font-medium">
                        Other Documents
                      </h6>
                      <div className="flex flex-wrap gap-4">
                        {groupedDocuments?.["others"].map((document) => (
                          <LandlordTenantInfoDocument
                            key={document.id}
                            {...document}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* CLOSE BUTTON */}
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded bg-brand-9 py-2 px-8"
                onClick={() => {
                  setIsCollapsibleOpen(false);
                }}
              >
                <div className="rotate-180">
                  <ThichDownArrow />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenancyRecord;