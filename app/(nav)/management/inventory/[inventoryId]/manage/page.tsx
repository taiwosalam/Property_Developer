"use client";
import React, { CSSProperties, useEffect, useState } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Select from "@/components/Form/Select/select";
import useDarkMode from "@/hooks/useCheckDarkMode";
import useFetch from "@/hooks/useFetch";
import {
  useParams,
  useSearchParams,
} from "next/dist/client/components/navigation";
import { deleteInventory, getBranches, updateInventory } from "../../data";
import { getBranch } from "@/components/Management/Inventory/data";
import {
  DeleteInventoryModal,
  DeleteInventoryModalSuccess,
} from "@/components/Modal/delete-inventory";
import { toast } from "sonner";
import { ManageInventorySkeleton } from "@/components/Skeleton/manageInventory";
import { handleAxiosError } from "@/services/api";
import { useRouter } from "next/navigation";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { InventoryFetchData } from "../types";

interface InventoryData {
  status: string;
  total_inventory: number;
  unit_name: string;
  property_title: string;
}

// TODO: Ts err
const ManageInventory = () => {
  const router = useRouter();
  const isDarkMode = useDarkMode();
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
  };
  const { inventoryId } = useParams(); //NB: THIS IS UNIT ID
  const INVENTORY_ID = useSearchParams().get("inventoryId");
  const PROPERTY_ID = useSearchParams().get("propertyId");
  const [inventoryItems, setInventoryItems] = useState<any>([]);
  const [moreInventory, setMoreInventory] = useState<number>(0);
  const [branch, setBranch] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<InventoryData>({
    status: "",
    total_inventory: 0,
    unit_name: "",
    property_title: "",
  });
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteInventoryModal, setDeleteInventoryModal] =
    useState<boolean>(false);
  const [deleteInventorySuccessModal, setDeleteInventorySuccessModal] =
    useState<boolean>(false);
  const [inventoryFiles, setInventoryFiles] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, loading, error, isNetworkError } = useFetch<InventoryFetchData>(
    `/inventory/unit/${inventoryId}`
  );

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
      }
    };

    const fetchAllBranches = async () => {
      try {
        const { data: branches } = await getBranches();
        setAllBranches(branches);
        // console.log("all branches", branches);
      } catch (error) {
        console.error("Error fetching all branches:", error);
      }
    };

    fetchBranchData();
    fetchAllBranches();
  }, [data]);

  const handleAddMoreInventory = () => {
    setMoreInventory((prev) => prev + 1);
  };

  const handleUpdateInventory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const totalItems = inventoryItems.length + moreInventory;

      // Create an array for all items
      const allItems = [];

      // Process existing items
      for (let i = 0; i < inventoryItems.length; i++) {
        const existingItem = inventoryItems[i];
        const retainMedia = inventoryFiles[i]
          ? inventoryFiles[i].filter((file: any) => typeof file === "string")
          : [];
        const images = inventoryFiles[i]
          ? inventoryFiles[i].filter((file: any) => file instanceof File)
          : [];

        allItems.push({
          id: existingItem?.id || undefined,
          description:
            (formData.get(`item-name-${i}`) as string) ||
            existingItem?.description ||
            "",
          unit:
            (formData.get(`quantity-${i}`) as string) ||
            existingItem?.unit ||
            "",
          condition:
            (formData.get(`condition-${i}`) as string) ||
            existingItem?.condition ||
            "",
          retain_media: retainMedia,
          images,
        });
      }

      // Process new items
      for (let i = inventoryItems.length; i < totalItems; i++) {
        const description = formData.get(`item-name-${i}`) as string;
        const unit = formData.get(`quantity-${i}`) as string;
        const condition = formData.get(`condition-${i}`) as string;
        const retainMedia = inventoryFiles[i]
          ? inventoryFiles[i].filter((file: any) => typeof file === "string")
          : [];
        const images = inventoryFiles[i]
          ? inventoryFiles[i].filter((file: any) => file instanceof File)
          : [];

        allItems.push({
          id: undefined, // New items won't have an ID yet
          description: description || "",
          unit: unit || "",
          condition: condition || "",
          retain_media: retainMedia,
          images,
        });
      }

      // Create FormData object
      const payload = new FormData();
      // payload.append("title", formData.get("inventory-title") as string);
      // payload.append("branch_id", formData.get("branch-name") as string);
      payload.append("video", formData.get("video-link") as string);

      // Append all items to the payload
      allItems.forEach((item, index) => {
        payload.append(`items[${index}][id]`, item.id || "");
        payload.append(`items[${index}][description]`, item.description);
        payload.append(`items[${index}][unit]`, item.unit);
        payload.append(`items[${index}][condition]`, item.condition);
        item.retain_media.forEach((media: string, mediaIndex: number) => {
          payload.append(`items[${index}][retain_media][${mediaIndex}]`, media);
        });
        item.images.forEach((image: string, imageIndex: number) => {
          payload.append(`items[${index}][images][${imageIndex}]`, image);
        });
      });

      // console.log("Payload for API:", payload);

      const success = await updateInventory(
        payload,
        Number(INVENTORY_ID),
        Number(inventoryId)
      );
      if (success) {
        toast.success("Inventory updated successfully!");
        router.push(`/management/inventory/${PROPERTY_ID}`);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInventory = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteInventory(inventoryId as string);
      if (success) {
        setDeleteInventoryModal(false);
        setDeleteInventorySuccessModal(true);
        setTimeout(() => {
          window.location.href = "/management/inventory";
        }, 1500);
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const InventoryRefObj = {
    status: "",
    total_inventory: 0,
    unit_name: "",
    property_title: "",
  };

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10 min-h-[80vh] pb-[150px] lg:pb-[100px]">
      {loading ? (
        <ManageInventorySkeleton />
      ) : (
        <form onSubmit={handleUpdateInventory}>
          <div className="custom-flex-col gap-4">
            <BackButton>Manage Inventory</BackButton>
            <div className="custom-flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <Input
                  id="video_link"
                  name="video_link"
                  placeholder="Video Link"
                  className="w-full"
                  style={input_styles}
                />
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
                  <KeyValueList
                    referenceObject={InventoryRefObj}
                    data={inventoryData}
                    chunkSize={2}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {[...Array(inventoryItems.length + moreInventory)].map(
              (_, index) => (
                <InventoryItem
                  key={index}
                  edit
                  index={index} // Use the current index for the item
                  inventoryFiles={inventoryFiles}
                  setInventoryFiles={setInventoryFiles}
                  data={inventoryItems[index] || {}} // Pass existing item data if available
                />
              )
            )}
          </div>
          <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
            <Modal
              state={{
                isOpen: deleteInventoryModal,
                setIsOpen: setDeleteInventoryModal,
              }}
            >
              <ModalTrigger asChild>
                <Button
                  size="sm_medium"
                  variant="light_red"
                  className="py-2 px-7"
                >
                  delete inventory
                </Button>
              </ModalTrigger>
              <ModalContent>
                <DeleteInventoryModal
                  handleDelete={handleDeleteInventory}
                  isDeleting={isDeleting}
                />
              </ModalContent>
            </Modal>
            <Modal
              state={{
                isOpen: deleteInventorySuccessModal,
                setIsOpen: setDeleteInventorySuccessModal,
              }}
            >
              <ModalContent>
                <DeleteInventoryModalSuccess />
              </ModalContent>
            </Modal>
            <div className="flex gap-6">
              <Button
                size="sm_medium"
                variant="border"
                onClick={handleAddMoreInventory}
                type="button"
                className="py-2 px-7"
              >
                Add more to inventory
              </Button>
              <Button size="sm_medium" className="py-2 px-7" type="submit">
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </FixedFooter>
        </form>
      )}
    </div>
  );
};

export default ManageInventory;
