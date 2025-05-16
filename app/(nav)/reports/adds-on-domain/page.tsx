"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   reportsListingsFilterOptionsWithDropdown,
//   trackingTableFields,
// } from "./data";
// import {
//   ActivityApiResponse,
//   ActivityTable,
//   transformActivityAData,
// } from "./[userId]/types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity } from "lucide-react";
import { DomainFields, SponsorFields } from "../../settings/add-on/data";

const AddsOnDomainRecord = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("b");

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        exports
        isDateTrue
        onBack={search ? true : false}
        pageTitle="Adds-On Domain"
        aboutPageModalData={{
          title: "Adds-On Domain",
          description: "This page contains a list of listing sponsor history",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={() => {}}
        //={() => {}}
        handleSearch={() => {}}
        //filterOptionsMenu={() => {}}
        hasGridListToggle={false}
        exportHref="/reports/adds-on-domain/export"
        // xlsxData={pageData.map((activity) => ({
        //   ...activity,
        //   location: address?.formattedAddress
        //     ? address.formattedAddress
        //     : "___ ___",
        // }))}
        // fileLabel={
        // "Activity Reports"}
      />
      <section>
        {[].length === 0 ? (
          <EmptyList
            noButton
            title="No Property Data Available Yet"
            body={
              <p>
                Currently, there is no property data available for export. Once
                data is added to the system, they will be displayed here and
                ready for download or export.
                <br />
                <br />
                <p>
                  This section will automatically update to show all available
                  property records as they are created or imported into the
                  platform.
                </p>
              </p>
            }
          />
        ) : (
          <CustomTable
            fields={DomainFields}
            data={[]}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
     
    </div>
  );
};

export default AddsOnDomainRecord;
