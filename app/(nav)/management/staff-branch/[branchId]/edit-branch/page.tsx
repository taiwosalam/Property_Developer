"use client";

import React, { useEffect, useState } from "react";

// Images
import { GridIcon, ListIcon } from "@/public/icons/icons";

// Imports
import clsx from "clsx";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import BackButton from "@/components/BackButton/back-button";
import SearchInput from "@/components/SearchInput/search-input";
import PropertyCard from "@/components/Management/Properties/property-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import EditBranchForm from "@/components/Management/Staff-And-Branches/Branch/edit-branch-form";
import DeleteBranchModal from "@/components/Management/Staff-And-Branches/Branch/delete-branch-modal";
import UpdateBranchModal from "@/components/Management/Staff-And-Branches/Branch/update-branch-modal";
import BranchPropertyListItem from "@/components/Management/Staff-And-Branches/Branch/branch-property-list-item";
import { useAuthStore } from "@/store/authstrore";
import { getOneBranch } from "../../data";
import { ResponseType } from "../types";
import { useParams } from "next/navigation";

const EditBranch = () => {
  const [state, setState] = useState<"grid" | "list">("grid");
  const [fetchedBranchData, setFetchedBranchData] =
    useState<ResponseType | null>();
  const { branchId } = useParams();

  const setGridView = () => {
    setState("grid");
  };
  const setListView = () => {
    setState("list");
  };

  const properties = fetchedBranchData?.property_list || [];

  const accessToken = useAuthStore((state) => state.access_token);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (typeof branchId === "string") {
        const data = await getOneBranch(branchId, accessToken);
        setFetchedBranchData(data);
        console.log(data);
      } else {
        console.error("Invalid branchId:", branchId);
      }
    };

    fetchBranchData();
  }, []);

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <BackButton>Edit Branch</BackButton>
          <div className="flex gap-3">
            <Modal>
              <ModalTrigger asChild>
                <Button
                  type="button"
                  variant="light_red"
                  size="base_medium"
                  className="py-2 px-8"
                >
                  delete branch
                </Button>
              </ModalTrigger>
              <ModalContent>
                <DeleteBranchModal />
              </ModalContent>
            </Modal>
            <Modal>
              <ModalTrigger asChild>
                <Button type="button" size="base_medium" className="py-2 px-8">
                  update
                </Button>
              </ModalTrigger>
              <ModalContent>
                <UpdateBranchModal />
              </ModalContent>
            </Modal>
          </div>
        </div>
        {fetchedBranchData && <EditBranchForm somedata={fetchedBranchData} />}
      </div>
      <div className="custom-flex-col gap-8">
        <div className="page-title-container">
          <PageTitle title="Edit Property" />
          <div className="flex items-center gap-4">
            <SearchInput placeholder="Search for Staff and Branch" />
            <div className="flex items-center gap-x-3">
              <button
                type="button"
                aria-label="list-view"
                className={clsx(
                  "p-1 rounded-md",
                  state === "list"
                    ? "bg-black text-white"
                    : "bg-transparent text-[unset]"
                )}
                onClick={setListView}
              >
                <ListIcon />
              </button>
              <button
                type="button"
                aria-label="grid-view"
                className={clsx(
                  "p-1 rounded-md",
                  state === "grid"
                    ? "bg-black text-white"
                    : "bg-transparent text-[unset]"
                )}
                onClick={setGridView}
              >
                <GridIcon />
              </button>
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
              <button>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Picture src={"/icons/sliders.svg"} alt="filters" size={20} />
                  <p className="text-[#344054] text-base font-medium">
                    Filters
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
        {state === "grid" ? (
          <AutoResizingGrid minWidth={350}>
            {properties.slice(0, 6).map((p, idx) => (
              <PropertyCard key={idx} {...p} />
            ))}
          </AutoResizingGrid>
        ) : (
          <div className="custom-flex-col gap-4">
            {properties.slice(0, 6).map((p, idx) => (
              <BranchPropertyListItem key={idx} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBranch;
