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

  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);

  const { data, error, loading } = useFetch<SingleBranchResponseType>(
    `branch/${branchId}`
  );

  const branchData = data ? transformSingleBranchAPIResponse(data) : null;

  if (loading) return <PageCircleLoader />;

  if (error) return <div>{error}</div>;

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex flex-col gap-8">
        <div className="flex gap-8 flex-col md:flex-row justify-between flex-wrap">
          <BackButton>Edit Branch</BackButton>
          <div className="flex gap-3">
            {/* <Modal>
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
            </Modal> */}
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
            <Button
              type="submit"
              size="sm_medium"
              className="py-2 px-8"
              form="edit-branch-form"
              disabled={updateRequestLoading}
            >
              {updateRequestLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
        <EditBranchForm
          somedata={branchData}
          setUpdateRequestLoading={setUpdateRequestLoading}
        />
      </div>
      <div className="custom-flex-col gap-8">
        <FilterBar
          pageTitle="Edit Property"
          searchInputPlaceholder="Search for Property"
          handleFilterApply={() => {}}
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
                  id={"1"}
                  images={[
                    "/empty/SampleProperty.jpeg",
                    "/empty/SampleProperty2.jpeg",
                    "/empty/SampleProperty3.jpeg",
                    "/empty/SampleProperty4.jpeg",
                    "/empty/SampleProperty5.jpeg",
                  ]}
                  property_name="Property 1"
                  total_units={1}
                  total_unit_pictures={5}
                  hasVideo={true}
                  property_type={index % 2 === 0 ? "rental" : "facility"}
                  currency="naira"
                  isClickable={false}
                  annualReturns={1000000}
                  annualIncome={1000000}
                  accountOfficer="John Doe"
                  last_updated="2021-01-01"
                  mobile_tenants={1}
                  web_tenants={1}
                  owing_units={1}
                  available_units={1}
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
                <BranchPropertyListItem />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBranch;
