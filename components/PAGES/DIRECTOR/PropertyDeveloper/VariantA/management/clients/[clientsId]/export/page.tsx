"use client";

import { useParams } from "next/navigation";
import React, { useRef } from "react";
import {
  statementTableFields,
  transformIndividualClientAPIResponse,
  generateDummyIndividualClientAPIResponse,
} from "../manage/data";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const ClientExport = () => {
  const { clientsId } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  const clientData = transformIndividualClientAPIResponse(
    generateDummyIndividualClientAPIResponse(String(clientsId))
  );

  const transformedTableData = clientData?.statement?.map((item:any) => ({
    ...item,
    name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{item.name || "--- ---"}</span>
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

  return (
    <div className="custom-flex-col gap-8">
      <BackButton>Client Statement</BackButton>
      <div ref={printRef}>
        <FilterBar
          pageTitle={clientData?.name}
          hasGridListToggle={false}
          handleFilterApply={() => { }}
          hiddenSearchInput
          exports
          isDateTrue
          printRef={printRef}
          noExclamationMark
          noFilterButton
        />

        <CustomTable
          fields={statementTableFields}
          data={transformedTableData ?? []}
          tableBodyCellSx={{ fontSize: "1rem" }}
          tableHeadCellSx={{ fontSize: "1rem" }}
        />
      </div>
    </div>
  );
};

export default ClientExport;
