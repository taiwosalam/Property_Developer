"use client";

// Imports
import Card from "@/components/dashboard/card";
import { getStaffDashboardCardData } from "./data";
import { SectionContainer } from "@/components/Section/section-components";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import Link from "next/link";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import { useEffect, useState } from "react";
import {
  CardData,
  DashboardBranchDataResponse,
} from "../../accountant/dashboard/types";
import useFetch from "@/hooks/useFetch";
import { ComplaintsPageData } from "../tasks/complaints/types";
import { ComplaintsResponse } from "../tasks/complaints/types";
import {
  ComplaintsDashboard,
  transformComplaintsData,
} from "../tasks/complaints/data";
import { transformComplaintDashboard } from "../tasks/complaints/data";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { useTourStore } from "@/store/tour-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CompanyStatusModal from "@/components/dashboard/company-status";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<CardData[]>([]);
  const { data, loading, error, isNetworkError } =
    useFetch<DashboardBranchDataResponse>("/branch-data");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setShouldRenderTour, completeTour, setPersist, isTourCompleted } =
    useTourStore();

  const company_status = usePersonalInfoStore((state) => state.company_status);
  const company_id = usePersonalInfoStore((state) => state.company_id);

  useEffect(() => {
    if (data) {
      setDashboardStats(getStaffDashboardCardData(data));
    }
  }, [data]);


  // ====== Handle Complaints KanbanBoard ======
  const [pageData, setPageData] = useState<ComplaintsPageData | null>(null);
  const [recentComplaints, setRecentComplaints] =
    useState<ComplaintsDashboard | null>(null);

  const { data: complaintData } = useFetch<ComplaintsResponse>(`/complaints`);

  useEffect(() => {
    if (complaintData) {
      const transformData = transformComplaintsData(complaintData);
      setPageData(transformData);

      const transformRecentComplaints =
        transformComplaintDashboard(complaintData);
      setRecentComplaints(transformRecentComplaints);
    }
  }, [complaintData]);

  // Open modal if company status is "pending" or "rejected"
  useEffect(() => {
    if (company_status === "pending" || company_status === "rejected") {
      setIsModalOpen(true);
    }
  }, [company_status]);

  // Tour logic
  useEffect(() => {
    if (loading) {
      // Wait for data to load
      setShouldRenderTour(false);
      return;
    }
    // Set persist to false for NavTour and DashboardTour
    setPersist(false);
    const hasNoProperties = dashboardStats.some(
      (stat) => stat.title === "Properties" && stat.value === "0"
    );

    const hasNoVacantUnits = dashboardStats.some(
      (stat) => stat.title === "Vacant Unit" && stat.value === "0"
    );
    const shouldRunTour =
      company_status === "approved" && hasNoProperties && hasNoVacantUnits;

    if (shouldRunTour) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [
    company_status,
    dashboardStats,
    loading,
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
  ]);

  return (
    <>
      {isModalOpen && (
        <Modal state={{ isOpen: isModalOpen, setIsOpen: setIsModalOpen }}>
          <ModalContent disableOutsideClick>
            <CompanyStatusModal
              status={company_status as "approved" | "pending" | "rejected"}
              id={Number(company_id)}
            />
          </ModalContent>
        </Modal>
      )}
      <section className="custom-flex-col gap-10">
        <div className="w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6">
          <div className="w-full xl:flex-1 space-y- xl:space-y-2">
            <div className="w-full flex py-1.5 xl:py-1 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
              {dashboardStats.map((card, index) => (
                <Link href={card.link} key={index} prefetch={false}>
                  <Card
                    title={card.title}
                    icon={<card.icon />}
                    value={card.value.toString()}
                    subvalue={card.subValue.toString()}
                    bg={card.bg}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
            <DashboarddCalendar />
          </div>
        </div>

        {/* =========== RECENT COMPLAINS =========== */}
        <SectionContainer
         
        heading="Recent Complains"
         
        href="/staff/tasks/complaints"
        
      >
          {pageData && pageData.complaints.length === 0 ? (
            <div className="bg-white flex w-full justify-center items-center h-full min-h-[300px] dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300">
              <p className="text-gray-500 dark:text-gray-400">
                No Recent Complains.
              </p>
            </div>
          ) : (
            <KanbanBoard kanbanTask={pageData?.complaints} />
          )}
        </SectionContainer>
      </section>
    </>
  );
};

export default Dashboard;
