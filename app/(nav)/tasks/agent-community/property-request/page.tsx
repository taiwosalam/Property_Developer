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
import { useEffect, useState } from "react";
import { getAllPropertyRequests, getThreads } from "../data";
import { empty } from "@/app/config";
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
    title: "My Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/tasks/agent-community/my-properties-request",
  },
];

interface PropertyRequestApiData {
  total_pages: number;
  total: number;
  property_requests: PropertyRequestDataType[];
  data: PropertyRequestDataType[];
  users: any[];
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
  const [propertyRequests, setPropertyRequests] = useState<any>([]);
  const [propertyRequestUsers, setPropertyRequestUsers] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<PropertyRequestApiData>(`/agent-community/property-requests/all?page=${currentPage}&query=${searchQuery}`);
  useRefetchOnEvent("refetchPropertyRequests", () => refetch({ silent: true }));

  const handleCreatePropertyRequestClick = () => {
    router.push("/tasks/agent-community/my-properties-request/create");
  };

  useEffect(() => {
    if (apiData) {
      setPropertyRequests(apiData?.property_requests);  
      setPropertyRequestUsers(apiData?.users);  
      console.log('api data', apiData);
    }
  }, [apiData]);

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);

  //   if (!Array.isArray(propertyRequests)) {
  //     return;
  //   }

  //   const filteredPropertyRequests = propertyRequests.filter(
  //     (request: PropertyRequestDataType) =>
  //       request.propertyTitle.toLowerCase().includes(query.toLowerCase()) ||
  //       request.description.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setPropertyRequests(filteredPropertyRequests);
  // };

  // useEffect(() => {
  //   const fetchPropertyRequests = async () => {
  //     setIsFetching(true);
  //     setError(null);
  //     try {
  //       const data = await getAllPropertyRequests();
  //       const propertyRequests = data.property_requests;
  //       const users = propertyRequests.map((item: any) => item.user);
  //       setPropertyRequests(propertyRequests);
  //       setPropertyRequestUsers(users);
  //       console.log("Property requests:", propertyRequests);
  //       console.log("Property request users:", users);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error
  //           ? err.message
  //           : "Failed to fetch property requests"
  //       );
  //       console.error("Error fetching property requests:", err);
  //     } finally {
  //       setIsFetching(false);
  //     }
  //   };

  //   fetchPropertyRequests();
  // }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const propertyRequestData: PropertyRequestDataType[] = propertyRequests.map((request: any) => ({
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

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center">
  <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
  </div>;

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
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />
      {propertyRequestData.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px] text-gray-500">
          No property requests found
        </div>
      ) : (
        <AutoResizingGrid gap={28} minWidth={400}>
          {isFetching
            ? Array(3)
                .fill(null)
                .map((_, index) => <RequestCardSkeleton key={index} />)
            : propertyRequestData.map((details, index) => (
                <PropertyRequestCard
                  key={index}
                  {...transformToPropertyRequestCardProps(details)}
                />
              ))}
        </AutoResizingGrid>
      )}
      <div className="pagination">
        <Pagination 
          totalPages={5} 
          currentPage={1} 
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
