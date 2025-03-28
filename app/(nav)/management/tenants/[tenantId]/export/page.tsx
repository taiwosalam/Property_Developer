"use client";

import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import TableLoading from "@/components/Loader/TableLoading";
import useFetch from "@/hooks/useFetch";
import React from "react";
import {
  IndividualTenantAPIResponse,
  statementTableFields,
  transformIndividualTenantAPIResponse,
} from "../manage/data";
import { useParams } from "next/navigation";
import CustomTable from "@/components/Table/table";

const TenantExport = () => {
  const { tenantId } = useParams();
  const {
    data: apiData,
    error,
    loading,
    refetch,
  } = useFetch<IndividualTenantAPIResponse>(`tenant/${tenantId}`);

  const tenant = apiData ? transformIndividualTenantAPIResponse(apiData) : null;

  return (
    <div className="custom-flex-col gap-8">
      <BackButton>{tenant?.name} Statement</BackButton>
      <FilterBar
        pageTitle="Tenant Statement"
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
            data={tenant?.statement ?? []}
            tableBodyCellSx={{ fontSize: "1rem" }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
        </section>
      )}
    </div>
  );
};

export default TenantExport;
