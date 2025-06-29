"use client";

import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import {
  announcementrFilterOptionsWithDropdown,
  getAllAnnouncements,
} from "./data";
import { Announcement } from "./types";
import FilterBar from "@/components/FIlterBar/FilterBar";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // console.log(announcements);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Announcement"
            newData={40}
            colorScheme={1}
            total={657}
          />
          <ManagementStatistcsCard
            title="Examine"
            newData={657}
            total={40}
            colorScheme={2}
          />
        </div>
        <Button
          href="/tasks/announcements/create-announcement"
          className="page-header-button"
        >
          + Create Announcement
        </Button>
      </div>
      <FilterBar
        azFilter
        pageTitle="Announcement"
        aboutPageModalData={{
          title: "Announcement",
          description:
            "This page contains a list of Announcement on the platform.",
        }}
        searchInputPlaceholder="Search Announcement"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={announcementrFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
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
              mediaCount={{ image: announcement.image_urls.length, video: 0 }}
              announcementId={announcement.id}
              video={null}
            />
          );
        })}
      </AutoResizingGrid>
    </div>
  );
};

export default AnnouncementPage;
