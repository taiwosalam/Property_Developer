"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import BackButton from "@/components/BackButton/back-button";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import InventoryUnitCard from "@/components/Management/Inventory/inventory-unit-card";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import useFetch from "@/hooks/useFetch";
import { transformInventoryUnitApiResponse } from "./data";
import Pagination from "@/components/Pagination/pagination";
import { AxiosRequestConfig } from "axios";
import {
  InventoryData,
  InventoryUnitPageData,
  InventoryApiResponse,
} from "./types";

const InventoryUnit = ({ params }: { params: { inventoryId: string } }) => {
  const [pageData, setPageData] = useState<InventoryUnitPageData | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const contentTopRef = useRef<HTMLDivElement>(null);

  const config: AxiosRequestConfig = useMemo(
    () => ({
      params: {
        page: currentPage,
      },
    }),
    [currentPage]
  );

  const { data, loading, isNetworkError, error } =
    useFetch<InventoryApiResponse>(`/inventory/${params.inventoryId}`, config);

    
  useEffect(() => {
    if (data) {
      const transformed = transformInventoryUnitApiResponse(data);
      setPageData(transformed);
      setInventoryData(transformed.propertiy_details);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <CustomLoader layout="page" pageTitle="Inventory Unit" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  if (!pageData || !inventoryData) return null;

  const {
    pagination: { current_page, total_pages },
    inventory_unit_data,
  } = pageData;

  return (
    <div className="custom-flex-col gap-6">
      <div
        ref={contentTopRef}
        className="w-full gap-2 flex items-center justify-between flex-wrap"
      >
        <BackButton reducePaddingTop className="dark:text-white text-black">
          {inventoryData.property_name || "--- ---"}
        </BackButton>
      </div>

      <div
        className="p-6 bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-4"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <p className="text-brand-9 text-lg font-semibold">Details</p>
        <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
          <InventoryListInfo data={inventoryData} chunkSize={2} />
        </div>
      </div>

      <div className="my-5">
        <AutoResizingGrid minWidth={315}>
          {inventory_unit_data.map((unit) => (
            <InventoryUnitCard
              page="account"
              key={unit.unitId}
              {...unit}
              propertyId={Number(params.inventoryId)}
            />
          ))}
        </AutoResizingGrid>
      </div>

      <Pagination
        totalPages={total_pages}
        currentPage={current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InventoryUnit;
