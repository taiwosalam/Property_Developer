"use client";

import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import TableLoading from "@/components/Loader/TableLoading";
import useFetch from "@/hooks/useFetch";
import React, { useRef } from "react";
import {
  IndividualTenantAPIResponse,
  statementTableFields,
  transformIndividualTenantAPIResponse,
} from "../manage/data";
import { useParams } from "next/navigation";
import CustomTable from "@/components/Table/table";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const TenantExport = () => {
  const { tenantId } = useParams();
  const {
    data: apiData,
    error,
    loading,
    refetch,
  } = useFetch<IndividualTenantAPIResponse>(`tenant/${tenantId}`);

  const tenant = apiData ? transformIndividualTenantAPIResponse(apiData) : null;
  // const transformedTableData = tenant?.statement?.map((item) => ({
  //   ...item,
  //   name: (
  //     <p className="flex items-center whitespace-nowrap">
  //       <span>{item.name}</span>
  //       {item.badge_color && <BadgeIcon color={item.badge_color} />}
  //     </p>
  //   ),
  // }));

  const printRef = useRef<HTMLDivElement>(null);
  return (
    <div className="custom-flex-col gap-8">
      <BackButton> Tenant Statement</BackButton>
      <div ref={printRef}>
        <FilterBar
          pageTitle={tenant?.name}
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
    </div>
  );
};

export default TenantExport;
