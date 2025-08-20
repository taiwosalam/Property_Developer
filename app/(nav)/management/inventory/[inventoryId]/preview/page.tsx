"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer with SSR disabled
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useParams, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { getBranch } from "@/components/Management/Inventory/data";
import { ManageInventorySkeleton } from "@/components/Skeleton/manageInventory";
import dayjs from "dayjs";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { InventoryFetchData } from "../types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";

interface InventoryData {
  status: string;
  total_inventory: number;
  unit_name: string;
  property_title: string;
}

// Helper function to validate video URL
const isValidVideoUrl = (url: string): boolean => {
  try {
    new URL(url);
    const videoUrlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|wistia\.com|vid\.yard|twitch\.tv|vidyard\.com)\/.+$/i;
    const videoFilePattern = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i;
    return videoUrlPattern.test(url) || videoFilePattern.test(url);
  } catch (error) {
    return false;
  }
};

//  Type for the data object
const PreviewInventory = () => {
  const { inventoryId } = useParams(); //NB: THIS IS UNIT ID
  const INVENTORY_ID = useSearchParams().get("inventoryId");
  const PROPERTY_ID = useSearchParams().get("propertyId");
  const [inventoryItems, setInventoryItems] = useState<any>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData>({
    status: "",
    total_inventory: 0,
    unit_name: "",
    property_title: "",
  });
  const { data, loading, error, isNetworkError } = useFetch<InventoryFetchData>(
    `/inventory/unit/${inventoryId}`
  );
  const [inventoryFiles, setInventoryFiles] = useState<any[]>([]);
  const [video, setVideo] = useState<string>("");

  useEffect(() => {
    const fetchBranchData = async () => {
      if (data) {
        const { data: apiData } = data;
        const updatedInventoryData: InventoryData = {
          status: apiData?.status || "--- ---",
          total_inventory: apiData?.total_inventory || 0,
          unit_name: apiData?.unit_name || "--- --",
          property_title: apiData?.property_title || "--- --",
        };
        setInventoryData(updatedInventoryData);
        setInventoryItems(apiData.items);
        setVideo(apiData.video);
      }
    };

    fetchBranchData();
  }, [data]);

  const InventoryRefObj = {
    status: "",
    total_inventory: 0,
    unit_name: "",
    property_title: "",
  };

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <>
      {loading && <ManageInventorySkeleton />}
      <div className="custom-flex-col gap-10 pb-[100px]">
        <div className="custom-flex-col gap-4">
          <BackButton>{inventoryData?.property_title}</BackButton>
          <div
            className="p-6 bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-4"
            style={{
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            }}
          >
            <p className="text-brand-9 text-lg font-semibold">Details</p>
            <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
              <KeyValueList
                referenceObject={InventoryRefObj}
                data={inventoryData}
                chunkSize={2}
              />
              {video && isValidVideoUrl(video) && (
                <div className="flex flex-col gap-2 self-end justify-end">
                  <Modal>
                    <ModalTrigger>
                      <Button size="sm" className="py-1 px-4">
                        View Video
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <LandlordTenantModalPreset heading="Inventory Video">
                        <div className="h-[400px] relative w-full">
                          <ReactPlayer
                            url={video}
                            controls
                            width="100%"
                            height="100%"
                            className="object-cover object-center"
                            config={{
                              youtube: {
                                playerVars: {
                                  rel: 0,
                                  modestbranding: 1,
                                  disablekb: 1,
                                  fs: 0,
                                  showinfo: 0,
                                  iv_load_policy: 3,
                                  origin:
                                    typeof window !== "undefined"
                                      ? window.location.origin
                                      : "",
                                },
                              },
                            }}
                          />
                        </div>
                      </LandlordTenantModalPreset>
                    </ModalContent>
                  </Modal>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="custom-flex-col gap-4">
          <h2 className="text-black dark:text-white text-xl font-medium">
            Added Inventory
          </h2>
          {inventoryItems.length === 0 ? (
            <div>No Inventory Added Yet!</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {inventoryItems?.map((item: any, index: number) => (
                <InventoryItem
                  key={index}
                  index={index}
                  data={item}
                  video={video}
                  setInventoryFiles={setInventoryFiles}
                  inventoryFiles={inventoryFiles}
                />
              ))}
            </div>
          )}
        </div>
        <FixedFooter className="flex gap-6 justify-end">
          <Button
            href={`/management/inventory/${inventoryId}/manage?inventoryId=${INVENTORY_ID}&propertyId=${PROPERTY_ID}`}
            size="sm_medium"
            className="py-2 px-7"
          >
            Manage inventory
          </Button>
        </FixedFooter>
      </div>
    </>
  );
};

export default PreviewInventory;
