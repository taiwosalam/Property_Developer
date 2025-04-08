"use client";

import useFetch from "@/hooks/useFetch";
import { useParams, useRouter } from "next/navigation";
import React, { useRef } from "react";
import {
  IndividualLandlordAPIResponse,
  statementTableFields,
  transformIndividualLandlordAPIResponse,
} from "../manage/data";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import TableLoading from "@/components/Loader/TableLoading";
import CustomTable from "@/components/Table/table";
import { walletTableFields } from "@/app/(nav)/wallet/data";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const LandlordExport = () => {
  const { landlordId } = useParams();
  const router = useRouter();
  const { data, error, loading, isNetworkError, refetch } =
    useFetch<IndividualLandlordAPIResponse>(`landlord/${landlordId}`);
  //   useRefetchOnEvent("refetchlandlord", () => refetch({ silent: true }));

  const landlordData = data
    ? transformIndividualLandlordAPIResponse(data)
    : null;

  const transformedTableData = landlordData?.statement?.map((item) => ({
    ...item,
    name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{item.name}</span>
        {item.badge_color && <BadgeIcon color={item.badge_color} />}
      </p>
    ),
    credit: (
      <p className={item.credit ? "text-status-success-3" : ""}>
        {item.credit ? item.credit : "--- ---"}
      </p>
    ),
    debit: (
      <p className={item.debit ? "text-status-error-2" : ""}>
        {item.debit ? item.debit : "--- ---"}
      </p>
    ),
  }));

  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="custom-flex-col gap-8">
      <BackButton>Landlord Statement</BackButton>
      <div ref={printRef}>
        <FilterBar
          pageTitle={landlordData?.name}
          hasGridListToggle={false}
          handleFilterApply={() => {}}
          hiddenSearchInput
          exports
          isDateTrue
          printRef={printRef}
          noExclamationMark
          noFilterButton
          // filterOptionsMenu={transactionHistoryFilterMenu}
          // appliedFilters={appliedFilters}
        />

        {loading ? (
          <TableLoading />
        ) : (
          <CustomTable
            fields={statementTableFields}
            data={transformedTableData ?? []}
            tableBodyCellSx={{ fontSize: "1rem" }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
        )}
      </div>
    </div>
  );
};

export default LandlordExport;
