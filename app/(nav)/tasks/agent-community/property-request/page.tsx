"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { PropertyRequestDataType } from "./data";
import { AgentCommunityRequestCardProps } from "@/components/tasks/CallBack/types";
import Button from "@/components/Form/Button/button";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import Pagination from "@/components/Pagination/pagination";
import { PlusIcon } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { propertyRequestOptions, stateOptions } from "../../inspections/data";
import { useEffect, useMemo, useState } from "react";
import { getAllPropertyRequests, getThreads } from "../data";
import { empty } from "@/app/config";
import { RequestCardSkeleton } from "../components";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import EmptyList from "@/components/EmptyList/Empty-List";
import NetworkError from "@/components/Error/NetworkError";

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

interface PropertyRequestApiData {
  data: PropertyRequestDataType[];
  meta: {
    current_month_requests: number;
    total_requests: number;
    pagination: {
      current_page: number;
      total: number;
    };
  };
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

const PropertyRequest = () => {
  const router = useRouter();
  const initialState: PropertyRequestApiData = {
    data: [],
    meta: {
      current_month_requests: 0,
      total_requests: 0,
      pagination: {
        current_page: 0,
        total: 0,
      },
    },
  };
  const [state, setState] = useState<PropertyRequestApiData>(initialState);
  const {
    data,
    meta: {
      current_month_requests,
      total_requests,
      pagination: { current_page, total },
    },
  } = state;

  const handleCreatePropertyRequestClick = () => {
    router.push("/tasks/agent-community/my-properties-request/create");
  };

  const [searchQuery, setSearchQuery] = useState("");

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
    silentLoading,
    isNetworkError,
  } = useFetch<PropertyRequestApiData>(
    `/agent-community/property-requests/all`,
    config
  );

  useRefetchOnEvent("refetchPropertyRequests", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState((prevState) => ({
        ...prevState,
        data: apiData.data,
        meta: apiData.meta,
      }));
    }
  }, [apiData]);

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "___";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return "___";
    }
  };

  const propertyRequestData: PropertyRequestDataType[] =
    data.map((request: any) => ({
      requestId: request.propertyRequest.id,
      userName: request.user?.name || "__",
      requestDate: formatDate(request.propertyRequest.created_at) || "__",
      pictureSrc: request.user?.picture || empty,
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

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Request"
          newData={current_month_requests}
          total={total_requests}
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
        pageTitle="Property Request"
        aboutPageModalData={{
          title: "Property Request",
          description:
            "This page contains a list of Property Request on the platform.",
        }}
        searchInputPlaceholder="Search Property Request"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[
          {
            label: "All Property Request",
            value: "all",
          },
          {
            label: "Trending Property Request",
            value: "trending",
          },
          {
            label: "New Property Request",
            value: "new",
          },
        ]}
        hasGridListToggle={false}
        filterOptionsMenu={stateOptions}
        handleSearch={handleSearch}
      />
      {propertyRequestData.length === 0 && !silentLoading ? (
        searchQuery ? (
          "No Search Found"
        ) : (
          <section>
            <EmptyList
              buttonText="+ Create New Property Request"
              buttonLink="/tasks/agent-community/my-properties-request/create"
              title="The property request files are empty"
              body={
                <p>
                  Create a property request by clicking on the &quot;Create New
                  Property Request&quot; button.
                </p>
              }
            />
          </section>
        )
      ) : (
        <AutoResizingGrid gap={28} minWidth={400}>
          {silentLoading ? (
            <RequestCardSkeleton />
          ) : (
            propertyRequestData.map((details, index) => (
              <PropertyRequestCard
                key={index}
                {...transformToPropertyRequestCardProps(details)}
              />
            ))
          )}
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

export default PropertyRequest;
