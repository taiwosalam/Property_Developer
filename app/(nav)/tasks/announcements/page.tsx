"use client";

import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useAuthStore } from "@/store/authstrore";
import { getAllAnnouncements } from "./data";
import { Announcement } from "./types";

const AnnouncementPage = () => {
  const { isSmallTablet } = useWindowWidth();
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
        {!isSmallTablet && (
          <AutoResizingGrid minWidth={220} containerClassName="w-full">
            <ManagementStatistcsCard
              title="Announcement"
              newData={40}
              total={657}
            />
            <ManagementStatistcsCard title="Examine" newData={657} total={40} />
          </AutoResizingGrid>
        )}

        <Button
          href="/tasks/announcements/create-announcement"
          className="page-header-button"
        >
          + Create Announcement
        </Button>
      </div>
      <div className="page-title-container">
        <PageTitle title="Announcement" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput />
          <FilterButton />
        </div>
      </div>
      <AutoResizingGrid minWidth={315} gap={32}>
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            title={announcement.title}
            date={announcement.created_at}
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
        ))}
      </AutoResizingGrid>
    </div>
  );
};

export default AnnouncementPage;
