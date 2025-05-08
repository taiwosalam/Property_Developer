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
import { useRouter } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity } from "lucide-react";
import {
  DomainFields,
  enrollment_subscriptions,
  SponsorFields,
} from "../../settings/add-on/data";

const SubscriptionRecord = () => {
  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack
        pageTitle="Subscription History"
        aboutPageModalData={{
          title: "Subscription History",
          description:
            "This page contains a list of listing subscription history",
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
        // fileLabel={"Activity Reports"}
      />
      <section>
        <CustomTable
          fields={enrollment_subscriptions.fields}
          data={[]}
          tableHeadClassName="h-[45px]"
        />
      </section>
    </div>
  );
};

export default SubscriptionRecord;
