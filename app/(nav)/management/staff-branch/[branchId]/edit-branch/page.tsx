"use client";

import { useState } from "react";
import Link from "next/link";
// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import PropertyCard from "@/components/Management/Properties/property-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import EditBranchForm from "@/components/Management/Staff-And-Branches/Branch/edit-branch-form";
import DeleteBranchModal from "@/components/Management/Staff-And-Branches/Branch/delete-branch-modal";
import UpdateBranchModal from "@/components/Management/Staff-And-Branches/Branch/update-branch-modal";
import BranchPropertyListItem from "@/components/Management/Staff-And-Branches/Branch/branch-property-list-item";
import LockBranchModal from "@/components/Management/Staff-And-Branches/Branch/lock-branch-modal";
import UnLockBranchModal from "@/components/Management/Staff-And-Branches/Branch/unlock-branch-modal";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import type { SingleBranchResponseType } from "../types";
import { transformSingleBranchAPIResponse } from "../data";

const EditBranch = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const [isGridView, setIsGridView] = useState(true);

  const [isOpen, setOpen] = useState(false);

  const { data, error, loading } = useFetch<SingleBranchResponseType>(
    `branch/${branchId}`
  );

  const branchData = data ? transformSingleBranchAPIResponse(data) : null;

  if (loading) return <PageCircleLoader />;

  if (error) return <div>{error}</div>;

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex flex-col gap-8">
        <div className="flex gap-8 flex-col sm:flex-row justify-between">
          <BackButton>Edit Branch</BackButton>
          <div className="flex gap-3">
            <Modal>
              <ModalTrigger asChild>
                <Button
                  type="button"
                  size="sm_medium"
                  className="py-2 px-8 border-status-caution-2 text-status-error-2"
                  variant="blank"
                >
                  Lock Branch !
                </Button>
              </ModalTrigger>
              <ModalContent>
                <LockBranchModal />
              </ModalContent>
            </Modal>
            <Modal>
              <ModalTrigger asChild>
                <Button
                  type="button"
                  variant="blank"
                  size="sm_medium"
                  className="py-2 px-8 border-status-success-2 text-brand-9"
                >
                  Un-Lock Branch !
                </Button>
              </ModalTrigger>
              <ModalContent>
                <UnLockBranchModal />
              </ModalContent>
            </Modal>
            <Modal>
              <ModalTrigger asChild>
                <Button
                  type="button"
                  variant="light_red"
                  size="sm_medium"
                  className="py-2 px-4 sm:px-8 text-xs sm:text-sm"
                >
                  Delete Branch
                </Button>
              </ModalTrigger>
              <ModalContent>
                <DeleteBranchModal />
              </ModalContent>
            </Modal>
            <Modal
              state={{
                isOpen: isOpen,
                setIsOpen: setOpen,
              }}
            >
              <ModalTrigger asChild>
                <Button
                  type="submit"
                  size="sm_medium"
                  className="py-2 px-8"
                  form="edit-branch-form"
                >
                  update
                </Button>
              </ModalTrigger>
              <ModalContent>
                <UpdateBranchModal />
              </ModalContent>
            </Modal>
          </div>
        </div>
        <EditBranchForm somedata={branchData} handleSubmit={() => {}} />
      </div>
      <div className="custom-flex-col gap-8">
        <FilterBar
          pageTitle="Edit Property"
          searchInputPlaceholder="Search for Property"
          filterWithOptionsWithDropdown={[]}
          handleFilterApply={() => {}}
          onStateSelect={() => {}}
          gridView={isGridView}
          setGridView={() => setIsGridView(true)}
          setListView={() => setIsGridView(false)}
        />
        {isGridView ? (
          <AutoResizingGrid minWidth={315}>
            {/* {properties.slice(0, 6).map((p, idx) => (
              <PropertyCard key={idx} {...p} />
            ))} */}
            {Array.from({ length: 5 }).map((_, index) => (
              <Link
                key={index}
                href={`/management/properties/${index}/edit-property`}
              >
                <PropertyCard
                  address="123 Main St"
                  id={1}
                  propertyId={1}
                  images={[
                    "/empty/SampleProperty.jpeg",
                    "/empty/SampleProperty2.jpeg",
                    "/empty/SampleProperty3.jpeg",
                    "/empty/SampleProperty4.jpeg",
                    "/empty/SampleProperty5.jpeg",
                  ]}
                  name="Property 1"
                  units={1}
                  price={1000}
                  propertyType={index % 2 === 0 ? "rental" : "facility"}
                  currency="Naira"
                  isClickable={false}
                />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <div className="custom-flex-col gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Link
                key={index}
                href={`/management/properties/${index}/edit-property`}
                className="block"
              >
                <BranchPropertyListItem
                  address="123 Main St"
                  id={1}
                  propertyId={1}
                  images={[
                    "/empty/empty.svg",
                    "/empty/empty.svg",
                    "/empty/empty.svg",
                    "/empty/empty.svg",
                    "/empty/empty.svg",
                  ]}
                  name="Property 1"
                  units={1}
                  price={1000}
                  propertyType={index % 2 === 0 ? "rental" : "facility"}
                  currency="Naira"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBranch;
