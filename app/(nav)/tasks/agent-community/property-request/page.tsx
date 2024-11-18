"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  PropertyRequestData,
  PropertyRequestDataType,
} from "@/app/(nav)/tasks/property-request/data";
import Button from "@/components/Form/Button/button";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import { AgentCommunityRequestCardProps } from "../type";
import Pagination from "@/components/Pagination/pagination";
import { PlusIcon } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { propertyRequestOptions, stateOptions } from "../../inspections/data";
import { useEffect, useState } from "react";
import { getAllPropertyRequests, getThreads } from "../data";
import { empty } from "@/app/config";
import { RequestCardSkeleton } from "../components";
const lists = [
  {
    title: "All Community Articles",
    desc: "Explore announcements and updates from your area or nationwide, shared by leading real estate professionals. Stay informed on the latest market insights, property matters, and real estate events to stay updated.",
    link: "/tasks/agent-community",
  },
  {
    title: "My Articles",
    desc: "Assess the Articles youve initiated, any modifications made to it, and its overall performance.",
    link: "/tasks/agent-community/my-articles",
  },
  {
    title: "My Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/tasks/agent-community/my-properties-request",
  },
];

const transformToPropertyRequestCardProps = (
  data: PropertyRequestDataType
): AgentCommunityRequestCardProps => {
  return {
    cardType: "agent-community",
    cardViewDetails: [
      { label: "Location (State)", accessor: "state" },
      { label: "Local Government", accessor: "lga" },
      { label: "Property Type", accessor: "propertyType" },
      { label: "Category", accessor: "category" },
      { label: "Min Budget", accessor: "minBudget" },
      { label: "Max Budget", accessor: "maxBudget" },
    ],
    ...data,
  };
};

const PropertyRequest = () => {
  const router = useRouter();
  const [propertyRequests, setPropertyRequests] = useState<any>([]);
  const [propertyRequestUser, setPropertyRequestUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const handleCreatePropertyRequestClick = () => {
    router.push("/tasks/agent-community/my-properties-request/create");
  };

  useEffect(() => {
    const fetchPropertyRequests = async () => {
      setIsFetching(true);  
      setError(null);
      try {
        const data = await getAllPropertyRequests();
        const propertyRequests = data.property_requests[0].propertyRequest;
        const propertyRequestUser = data.property_requests[0].user;
        setPropertyRequests(propertyRequests);
        setPropertyRequestUser(propertyRequestUser);
        console.log('Property request:', propertyRequests);
        console.log('Property request user:', propertyRequestUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property requests');
        console.error('Error fetching property requests:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPropertyRequests();
  }, []);


  const propertyRequestData:PropertyRequestDataType[] = [
    {
      requestId: propertyRequests?.id,
      userName: propertyRequestUser?.name || "name here",
      requestDate: propertyRequests?.created_at || "date here",
      pictureSrc: propertyRequestUser?.picture || empty,
      state: propertyRequests?.state || "state here",
      lga: propertyRequests?.lga || "lga here",
      propertyType: propertyRequests?.property_type || "property type here",
      category: propertyRequests?.category || "category here",
      subType: propertyRequests?.sub_type || "sub type here",
      minBudget: propertyRequests?.min_budget || "₦75,000,000",
      maxBudget: propertyRequests?.max_budget || "₦200,000,000",
      requestType: "Web",
      description: propertyRequests?.description || "description here",
      phoneNumber: propertyRequestUser?.phone || "phone number here",
      propertyTitle: propertyRequests?.title || "property title here",
      isLoading: isFetching,
    },
  ];

  return (
    <div className="space-y-9">
      <div className="flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Request"
          newData={34}
          total={657}
          colorScheme={1}
          className="hidden md:block"
        />
        <div className="w-full flex justify-center items-center md:justify-end md:w-auto md:items-center">
          <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + Community Board
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CommunityBoardModal lists={lists} />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <FilterBar
        azFilter
        onStateSelect={() => {}}
        pageTitle="Property Request"
        aboutPageModalData={{
          title: "Property Request",
          description:
            "This page contains a list of Property Request on the platform.",
        }}
        searchInputPlaceholder="Search Property Request"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        hasGridListToggle={false}
        propertyRequest={true}
        filterWithOptionsWithDropdown={stateOptions}
      />
      {propertyRequestData.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px] text-gray-500">
          No property requests found
        </div>
      ) : (
        <AutoResizingGrid gap={28} minWidth={400}>
          {isFetching ? (
            Array(3).fill(null).map((_, index) => (
              <RequestCardSkeleton key={index} />
            ))
          ) : (
            propertyRequestData.map((details, index) => (
              <PropertyRequestCard
                isLoading={isFetching}
                key={index}
                {...transformToPropertyRequestCardProps(details)}
              />
            ))
          )}
        </AutoResizingGrid>
      )}
      <div className="pagination">
        <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
      </div>

      <div className="top-80 right-4 fixed rounded-full">
        <button
          onClick={handleCreatePropertyRequestClick}
          className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default PropertyRequest;
