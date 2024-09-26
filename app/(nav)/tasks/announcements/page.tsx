"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import AnnouncementCard from "@/components/tasks/announcements/announcement-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useWindowWidth from "@/hooks/useWindowWidth";

const AnnouncementPage = () => {
  const { isSmallTablet } = useWindowWidth();
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

        <Button href="/tasks/announcements/create-announcement" className="page-header-button">
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
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <AnnouncementCard key={index} />
          ))}
      </AutoResizingGrid>
    </div>
  );
};

export default AnnouncementPage;
