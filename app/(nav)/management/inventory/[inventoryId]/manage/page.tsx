"use client";
import React, { CSSProperties, useEffect, useState } from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import InventoryItem from "@/components/Management/Inventory/inventory-item";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { InventoryListInfo } from "@/components/Management/Inventory/inventory-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Select from "@/components/Form/Select/select";
import useDarkMode from "@/hooks/useCheckDarkMode";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/dist/client/components/navigation";
import { deleteInventory, getBranches, updateInventory } from "../../data";
import { getBranch } from "@/components/Management/Inventory/data";
import { DeleteInventoryModal, DeleteInventoryModalSuccess } from "@/components/Modal/delete-inventory";
import { toast } from "sonner";
import { ManageInventorySkeleton } from "@/components/Skeleton/manageInventory";
import { handleAxiosError } from "@/services/api";

// TODO: Ts err

interface InventoryData {
  title: string;
  inventory_id: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
  branch_id: string;
  video?: string;
}

//  Type for the data object
interface FetchData {
  data: {
    id: string;
    title: string;
    video: string;
    branch_name: string;
    branch_id: string;
    created_date: string;
    edited_date: string;
    property_name: string;
    account_officer: string;
    items: {
      id: string;
      description: string;
      image: any[];
      unit: string;
      condition: string;
    };
  };
}


const ManageInventory = () => {
  const isDarkMode = useDarkMode();
  const input_styles: CSSProperties = {
    padding: "12px 14px",
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  const { inventoryId } = useParams();
  const [inventoryItems, setInventoryItems] = useState<any>([]);
  const [moreInventory, setMoreInventory] = useState<number>(0);
  const [branch, setBranch] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteInventoryModal, setDeleteInventoryModal] = useState<boolean>(false); 
  const [deleteInventorySuccessModal, setDeleteInventorySuccessModal] = useState<boolean>(false);
  const [inventoryFiles, setInventoryFiles] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { data, loading, error } = useFetch<FetchData>(`/inventory/${inventoryId}`);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (data) {
         const { data: apiData } = data;
        const updatedInventoryData: InventoryData = {
          title: apiData.title || "",
          inventory_id: apiData.id || "",
          created_date: apiData.created_date || "",
          edited_date: apiData.edited_date || "",
          property_name: apiData.property_name || "",
          branch_name: apiData.branch_name || "",
          account_officer: apiData.account_officer || "",
          branch_id: apiData.branch_id || "",
          video: apiData.video || "",
        };
        setInventoryData(updatedInventoryData);
        setInventoryItems(apiData.items);
      }
    };

    // console.log("inventoryItems", inventoryItems);

    const fetchAllBranches = async () => {
      try {
        const { data: branches } = await getBranches();
        setAllBranches(branches);
        console.log("all branches", branches);
      } catch (error) {
        console.error("Error fetching all branches:", error);
      }
    };

    fetchBranchData();
    fetchAllBranches();
  }, [data]);

  const handleUpdateInventory = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  setIsLoading(true);
  try {
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("inventory-title") as string,
      video: formData.get("video-link") as string,
      branch_id: formData.get("branch-name") as string,
      items: inventoryItems.map((item: any, index: number) => {
        const retainMedia = inventoryFiles[index]
          ? inventoryFiles[index].filter((file: any) => typeof file === "string")
          : [];
        const images = inventoryFiles[index]
          ? inventoryFiles[index].filter((file: any) => file instanceof File)
          : [];
        return {
          id: item.id || undefined,
          description: item.description,
          unit: item.unit,
          condition: item.condition,
          retain_media: retainMedia,
          images,
        };
      }),
    };

    // Convert payload for multipart/form-data
    // const formPayload = new FormData();
    // formPayload.append("title", payload.title);
    // formPayload.append("video", payload.video);
    // formPayload.append("branch_id", payload.branch_id);

    // payload.items.forEach((item: any, itemIndex: number) => {
    //   formPayload.append(`items[${itemIndex}][description]`, item.description);
    //   formPayload.append(`items[${itemIndex}][unit]`, item.unit);
    //   formPayload.append(`items[${itemIndex}][condition]`, item.condition);
    //   // formPayload.append('_method', 'PUT')

    //   item.retain_media.forEach((media: any, mediaIndex: number) => {
    //     formPayload.append(
    //       `items[${itemIndex}][retain_media][${mediaIndex}]`,
    //       media
    //     );
    //   });

    //   item.images.forEach((image: any, imageIndex: number) => {
    //     formPayload.append(
    //       `items[${itemIndex}][images][${imageIndex}]`,
    //       image
    //     );
    //   });
    // });

    console.log("Payload for API:", payload);

    const success = await updateInventory(payload, inventoryId as string);

      if (success) {
        toast.success("Inventory updated successfully!");
      }
  } catch (error) {
    console.error("Error updating inventory:", error);
    handleAxiosError(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleAddMoreInventory = () => {
    setMoreInventory((prev) => prev + 1);
  };

  const handleDeleteInventory = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteInventory(inventoryId as string);
      if (success) {
        setDeleteInventoryModal(false);
        setDeleteInventorySuccessModal(true);
        setTimeout(() => {
          window.location.href = '/management/inventory';
        }, 1500);
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
    } finally {
      setIsDeleting(false)
    }
  };

  return (
    <div className="custom-flex-col gap-10 min-h-[80vh] pb-[150px] lg:pb-[100px]">
      {loading ? (
        <ManageInventorySkeleton />
      ) : (
        <form onSubmit={handleUpdateInventory}>
          <div className="custom-flex-col gap-4">
            <BackButton>Manage Inventory</BackButton>
            <div className="custom-flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8">
                <Input
                  id="inventory-title"
                  defaultValue={inventoryData?.title || ""}
                  className="flex-1 dark:bg-darkText-primary dark:text-darkText-1"
                  style={input_styles}
                />
                <Input
                  id="video-link"
                  placeholder="Video Link"
                  defaultValue={inventoryData?.video || ""}
                  className="flex-1"
                  style={input_styles}
                />
                <Select
                  id="branch-name"
                  placeholder="Branch Name"
                  options={
                    allBranches.map((branch) => ({
                      label: branch.branch_name,
                      value: String(branch.id),
                    })) || []
                  }
                  value={
                    inventoryData?.branch_name
                      ? {
                          label: inventoryData.branch_name,
                          value: String(
                            allBranches.find(
                              (branch) =>
                                branch.branch_name === inventoryData.branch_name
                            )?.id
                          ),
                        }
                      : undefined
                  }
                  onChange={(selectedOption) => {
                    const selectedValue = selectedOption?.value;
                  }}
                  isSearchable={false}
                  className="bg-white dark:bg-darkText-primary flex-1"
                />
              </div>
              <div
                className="p-6 bg-white dark:bg-darkText-primary rounded-lg custom-flex-col gap-4"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
                }}
              >
                <p className="text-brand-10 dark:text-white text-base font-medium">
                  Details
                </p>
                <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
                  <InventoryListInfo data={inventoryData || {}} chunkSize={2} />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {inventoryItems.map((item: any, index: number) => (
              <InventoryItem
                key={index}
                index={index}
                data={item}
                edit
                inventoryFiles={inventoryFiles}
                setInventoryFiles={setInventoryFiles}
              />
            ))}

            {[...Array(moreInventory)].map((_, index) => (
              <InventoryItem
                key={index}
                edit
                index={index}
                inventoryFiles={inventoryFiles}
                setInventoryFiles={setInventoryFiles}
              />
            ))}
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
                  variant="blank"
                  type="button"
                  className="py-2 px-7 text-status-error-primary bg-status-error-1"
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
                variant="blank"
                onClick={handleAddMoreInventory}
                type="button"
                className="py-2 px-7 text-brand-9 bg-brand-1"
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
