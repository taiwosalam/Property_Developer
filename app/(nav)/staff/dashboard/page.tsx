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

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<CardData[]>([]);
  const { data, loading, error, isNetworkError } =
    useFetch<DashboardBranchDataResponse>("/branch-data");

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

  return (
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
  );
};

export default Dashboard;
