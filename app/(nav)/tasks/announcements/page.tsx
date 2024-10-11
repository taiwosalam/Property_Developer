"use client";

import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { useAuthStore } from "@/store/authstrore";
import { getAllAnnouncements } from "./data";
import { Announcement } from "./types";
import FilterBar from "@/components/FIlterBar/FilterBar";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { access_token } = useAuthStore();

  useEffect(() => {
    getAllAnnouncements(access_token).then((data) => {
      setAnnouncements(data);
    });
  }, [access_token]);

  console.log(announcements);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Announcement"
            newData={40}
            total={657}
          />
          <ManagementStatistcsCard title="Examine" newData={657} total={40} />
        </div>
        <Button
          href="/tasks/announcements/create-announcement"
          className="page-header-button"
        >
          + Create Announcement
        </Button>
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Announcement" aboutPageModalData={
        { title: "Announcement", description: "This page contains a list of Announcement on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={[]} />
      <AutoResizingGrid minWidth={315} gap={32}>
        {announcements.map((announcement, index) => {
          const formattedDate = new Date(
            announcement.created_at
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          return (
            <AnnouncementCard
              title={announcement.title}
              date={formattedDate}
              key={index}
              description={announcement.body}
              id={announcement.company_id}
              views={0}
              newViews={0}
              dislikes={0}
              imageUrls={announcement.image_urls}
              mediaCount={announcement.image_urls.length}
              announcementId={announcement.id}
            />
          );
        })}
      </AutoResizingGrid>
    </div>
  );
};

export default AnnouncementPage;
