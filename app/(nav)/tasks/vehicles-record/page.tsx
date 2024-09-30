"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useWindowWidth from "@/hooks/useWindowWidth";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import SearchInput from "@/components/SearchInput/search-input";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Button from "@/components/Form/Button/button";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import Pagination from "@/components/Pagination/pagination";

const VehiclesRecordPage = () => {
  const { isSmallTablet } = useWindowWidth();
  const fields: Field[] = [
    { id: "1", accessor: "avatar", isImage: true, picSize: 40 },
    { id: "2", label: "Name", accessor: "full_name" },
    { id: "3", label: "Plate Number", accessor: "plate_number" },
    { id: "4", label: "Guest / Visitor", accessor: "guest_visitor" },
    { id: "5", label: "Last Update", accessor: "last_update" },
    { id: "6", label: "Status", accessor: "status" },
    { id: "7", accessor: "action" },
  ];
  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      avatar: "/empty/SampleLandlord.jpeg",
      full_name: `Name ${index + 1}`,
      plate_number: `Plate Number ${index + 1}`,
      guest_visitor: `${index % 2 === 0 ? "Guest" : "Visitor"}`,
      last_update: `02/03/2024  ${index + 3}:30 PM`,
      status: `${index % 2 === 0 ? "Pending" : "Completed"}`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        {!isSmallTablet && (
          <AutoResizingGrid minWidth={245} containerClassName="w-full">
            <ManagementStatistcsCard
              title="Check In"
              newData={657}
              total={34}
            />
            <ManagementStatistcsCard
              title="Check Out"
              newData={657}
              total={34}
            />
            <ManagementStatistcsCard title="Pending" newData={657} total={34} />
          </AutoResizingGrid>
        )}
        <Button type="button" className="page-header-button">
          + Create New Record
        </Button>
      </div>
      <div className="page-title-container">
        <PageTitle title="Vehicles Record" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search" />
          <FilterButton />
        </div>
      </div>
      <CustomTable
        fields={fields}
        data={tableData}
        evenRowColor="#fff"
        oddRowColor="#EFF6FF"
        tableHeadClassName="bg-brand-5 h-[76px]"
        tableHeadCellSx={{
          fontSize: 16,
          color: "#050901",
          fontWeight: 500,
          border: "none",
          textAlign: "left",
        }}
        tableBodyCellSx={{
          fontWeight: 500,
          fontSize: 15,
          color: "#050901",
          border: "none",
          textAlign: "left",
          padding: "18px 16px",
        }}
      />
      <Pagination
        totalPages={3}
        currentPage={1}
        onPageChange={() => alert("function not implemented!")}
      />
    </div>
  );
};

export default VehiclesRecordPage;
