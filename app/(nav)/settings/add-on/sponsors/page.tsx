"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import BackButton from "@/components/BackButton/back-button";
import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import dayjs from "dayjs";
import { SponsorFields, sponsorUnitsData } from "./data";
import ExportPageFooter from "@/components/reports/export-page-footer";
import { SponsorDataTypes, transformSponsorResponse } from "../data";
import { SponsorListingsResponse } from "@/components/Settings/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import ServerError from "@/components/Error/ServerError";
import { CustomTableProps } from "@/components/Table/types";
import TableLoading from "@/components/Loader/TableLoading";
import { AxiosRequestConfig } from "axios";

const AllSponsorUnits = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState<SponsorDataTypes>({
    sponsor_value: 0,
    sponsor_listings: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total: 0,
    },
  });

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
    },
  });

  const { data, error, loading, refetch, isNetworkError, silentLoading } =
    useFetch<SponsorListingsResponse>("/sponsor/listings", config);
  useRefetchOnEvent("refetchRentSponsors", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      const transformed = transformSponsorResponse(data);
      setPageData((prevData) => ({
        ...transformed,
        sponsor_listings:
          transformed.pagination.current_page === 1
            ? transformed.sponsor_listings
            : [...prevData.sponsor_listings, ...transformed.sponsor_listings],
      }));
    }
  }, [data]);

  // --- Infinite Scroll Logic ---
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pageData.pagination.current_page < pageData.pagination.total_pages &&
          !silentLoading
        ) {
          // Load next page when the last row becomes visible
          setConfig({
            params: { page: pageData.pagination.current_page + 1 },
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [
      pageData.pagination.current_page,
      pageData.pagination.total_pages,
      silentLoading,
    ]
  );

  // Transform sponsor listings to attach lastRowRef to the last row
  const transformedListings = pageData.sponsor_listings.map(
    (listing, index) => ({
      ...listing,
      ref:
        index === pageData.sponsor_listings.length - 1 &&
        pageData.pagination.current_page < pageData.pagination.total_pages
          ? lastRowRef
          : undefined,
    })
  );

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };


  if (loading) return <TableLoading />;
  if (isNetworkError) return <NetworkError />;
  if (error) <ServerError error={error} />;

  return (
    <div className="space-y-9 pb-[100px]">
      <div ref={exportRef} className="space-y-9">
        <CustomTable
          data={transformedListings}
          fields={SponsorFields}
          {...table_style_props}
        />
        {silentLoading && pageData.pagination.current_page > 1 && (
          <div className="flex items-center justify-center py-4">
            <div className="loader" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSponsorUnits;
