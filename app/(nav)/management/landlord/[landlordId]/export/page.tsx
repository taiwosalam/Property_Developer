"use client";

import useFetch from "@/hooks/useFetch";
import { useParams, useRouter } from "next/navigation";
import React from "react";
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

  return (
    <div className="custom-flex-col gap-8">
      <BackButton>{landlordData?.name} Statement</BackButton>
      <FilterBar
        pageTitle="Landlord Statement"
        hasGridListToggle={false}
        handleFilterApply={() => {}}
        hiddenSearchInput
        exports
        isDateTrue
        // exportHref="/wallet/audit-trail/export"
        // filterOptionsMenu={transactionHistoryFilterMenu}
        // appliedFilters={appliedFilters}
      />

      {loading ? (
        <TableLoading />
      ) : (
        <section>
          <CustomTable
            fields={statementTableFields}
            data={transformedTableData ?? []}
            tableBodyCellSx={{ fontSize: "1rem" }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
        </section>
      )}
    </div>
  );
};

export default LandlordExport;
