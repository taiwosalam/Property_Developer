"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { formatDate, type PropertyRequestDataType } from "../property-request/data";
import Button from "@/components/Form/Button/button";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import type { AgentCommunityRequestCardProps } from "@/components/tasks/CallBack/types";
import Pagination from "@/components/Pagination/pagination";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLoggedInUserPropertyRequests } from "../data";
import { RequestCardSkeleton } from "../components";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

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
    title: "All Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/tasks/agent-community/property-request",
  },
];

interface PropertyRequestApiData {
  data: PropertyRequestDataType[];
  meta: {
    current_month_requests: number;
    total_requests: number;
    pagination: {
      current_page: number;
      total: number;
    }
  }
}

const transformToPropertyRequestCardProps = (
  data: PropertyRequestDataType
): AgentCommunityRequestCardProps => {
  return {
    cardType: "agent-community",
    cardViewDetails: [
      { label: "Target Audience", accessor: "targetAudience" },
      { label: "Local Government", accessor: "lga" },
      { label: "Property Type", accessor: "propertyType" },
      { label: "Category", accessor: "category" },
      { label: "Min Budget", accessor: "minBudget" },
      { label: "Max Budget", accessor: "maxBudget" },
    ],
    ...data,
  };
};

const MyPropertiesRequestPage = () => {
  const router = useRouter();
  const initialState: PropertyRequestApiData = {
    data: [],
    meta: {
      current_month_requests: 0,
      total_requests: 0,
      pagination: {
        current_page: 0,
        total: 0,
      }
    }
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState<PropertyRequestApiData>(initialState);
  const {
    data,
    meta: {
      current_month_requests,
      total_requests,
      pagination: {
        current_page,
        total
      }
    }
  } = state

  const handleCreatePropertyRequestClick = () => {
    router.push("/tasks/agent-community/my-properties-request/create");
  };

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setState((prevState) => ({
      ...prevState,
      meta: {
        ...prevState.meta,
        pagination: {
          ...prevState.meta.pagination,
          current_page: page,
        },
      },
    }));
  };

  const handleSearch = async (query: string) => {
    if (!query && !searchQuery) return;
    setSearchQuery(query);
  };

  const config = useMemo(
    () => ({
      params: { page: current_page, search: searchQuery },
    }),
    [current_page, searchQuery]
  );

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<PropertyRequestApiData>(`/agent-community/property-requests/all`, config);

  useRefetchOnEvent("refetchPropertyRequests", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState(prevState => ({
        ...prevState,
        data: apiData.data,
        meta: apiData.meta
      }))
    }
  }, [apiData])

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const propertyRequestData: PropertyRequestDataType[] = data.map((request: any) => ({
    requestId: request.propertyRequest.id,
    userName: request.user?.name || "__",
    requestDate: formatDate(request.propertyRequest.created_at) || "__",
    pictureSrc: request.user?.picture || "",
    state: request.propertyRequest.state || "__",
    lga: request.propertyRequest.lga || "__",
    propertyType: request.propertyRequest.property_type || "__",
    category: request.propertyRequest.property_category || "__",
    subType: request.propertyRequest.sub_type || "__",
    minBudget: `₦${request.propertyRequest.min_budget}` || "__",
    maxBudget: `₦${request.propertyRequest.max_budget}` || "__",
    requestType: "Web",
    description: request.propertyRequest.description || "__",
    phoneNumber: request.user?.phone || "__",
    propertyTitle: request.propertyRequest.title || "__",
    userTitle: request.user?.title || "__",
    targetAudience: request.propertyRequest.target_audience,
  })) || [];

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center">
    <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
  </div>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Request"
          newData={current_month_requests}
          colorScheme={1}
          total={total_requests}
        />
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
      <FilterBar
        azFilter
        onStateSelect={() => { }}
        pageTitle="My Properties Request"
        aboutPageModalData={{
          title: "My Properties Request",
          description:
            "This page contains a list of My Properties Request on the platform.",
        }}
        searchInputPlaceholder="Search My Properties Request"
        handleFilterApply={() => { }}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={[]}
        hasGridListToggle={false}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {propertyRequestData.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px] text-gray-500">
          You do not have any property requests
        </div>
      ) : (
        <AutoResizingGrid gap={28} minWidth={400}>
          {propertyRequestData.map((details, index) => (
            <PropertyRequestCard
              key={index}
              {...transformToPropertyRequestCardProps(details)}
              cardType="agent-community"
              user
            />
          ))}
        </AutoResizingGrid>
      )}
      <div className="pagination">
        <Pagination
          totalPages={total}
          currentPage={current_page}
          onPageChange={handlePageChange}
        />
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

export default MyPropertiesRequestPage;
