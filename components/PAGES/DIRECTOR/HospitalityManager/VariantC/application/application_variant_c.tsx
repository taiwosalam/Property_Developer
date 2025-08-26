"use client";

import FilterBar from "@/components/FIlterBar/FilterBar";

const HospitalityManagerApplicationVariantC = () => {
  return (
    <>
      <section>
        <div>Hospitality Manager Applications</div>
        <FilterBar
          azFilter
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Applications"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          dateLabel="Application Date"
          handleFilterApply={() => {}}
          handleSearch={() => {}}
          onSort={() => {}}
        />
      </section>
    </>
  );
};

export default HospitalityManagerApplicationVariantC;
