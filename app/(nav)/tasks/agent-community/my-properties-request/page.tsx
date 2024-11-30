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
    title: "All Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/tasks/agent-community/property-request",
  },
];

interface PropertyRequestApiData {
  data: PropertyRequestDataType[];
    current_month_requests: number;
    total_requests: number;
    meta: {
      current_page: number;
      total: number;
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
    current_month_requests: 0,
    total_requests: 0,
    meta: {
      current_page: 0,
      total: 0,
    },
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState<PropertyRequestApiData>(initialState);
  const {
      data,
      current_month_requests,
      total_requests,
      meta: {
        current_page,
        total
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
        current_page: page,
        total: total,
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
  } = useFetch<PropertyRequestApiData>(`/agent-community/property-requests/user`, config);

  useRefetchOnEvent("refetchPropertyRequests", () => refetch({ silent: true }));

  useEffect(() => {
    console.log("apiData", apiData)
    console.log('apiData meta -', apiData?.meta);
    if (apiData) {
      setState(prevState => ({
        ...prevState,
        data: apiData.data,
        meta: {
          ...prevState.meta,
          meta: {
            current_page: apiData.meta.current_page,
            total: apiData.meta.total,
          }
        }
      }))
    }
  }, [apiData])

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const propertyRequestData: PropertyRequestDataType[] = data.map((request: any) => ({
    requestId: request.id,
    userName: request.user?.name || "__",
    requestDate: formatDate(request.created_at) || "__",
    pictureSrc: request.user?.picture || "",
    state: request.state || "__",
    lga: request.lga || "__",
    propertyType: request.property_type || "__",
    category: request.property_category || "__",
    subType: request.sub_type || "__",
    minBudget: `₦${request.min_budget}` || "__",
    maxBudget: `₦${request.max_budget}` || "__",
    requestType: "Web",
    description: request.description || "__",
    phoneNumber: request.user?.phone || "__",
    propertyTitle: request.title || "__",
    userTitle: request.user?.title || "__",
    targetAudience: request.target_audience,
  })) || [];

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center">
    <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
  </div>;

  if (isNetworkError) return <NetworkError />;

  if (error) return <p className="text-base text-red-500 font-medium">{error}</p>;

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
      />

        {propertyRequestData.length === 0 && !silentLoading ? (
          searchQuery ? (
            "No Search Found"
          ) : (
          <section>
            <EmptyList
              buttonText="+ Create New Property Request"
              buttonLink="/tasks/agent-community/my-properties-request/create"
              title="You do not have any property requests"
              body={
                <p>Create a property request by clicking on the &quot;Create New Property Request&quot; button.</p>
              }
            />
          </section>
        )
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
