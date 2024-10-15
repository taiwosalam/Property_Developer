"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsCallsFilterOptionsWithDropdown } from "./data";

const Call = () => {
    const fields: Field[] = [
        { id: "0", label: "S/N", accessor: "S/N" },
        { id: "1", label: "ID", accessor: "id" },
        {
            id: "2",
            label: "Bracnh",
            accessor: "branch",
        },
        { id: "3", label: "Property", accessor: "property_name" },
        {
            id: "5",
            label: "Requester",
            accessor: "requester",
        },
        { id: "7", label: "Requuest Date", accessor: "request_date" },
        { id: "7", label: "Resolve Date & Time", accessor: "resolve_date_time" },
    ];

    const generateTableData = (numItems: number) => {
        return Array.from({ length: numItems }, (_, index) => ({
            id: '123456789',
            branch: 'Akinyele Branch',
            property_name: 'Property Name',
            requester: 'Ajayi David',
            request_date: '12/02/2024',
            resolve_date_time: '12/02/2024 - 03:30am',
        }));
    };

    const tableData = generateTableData(10);

    return (
        <div className="space-y-9">
            <div className="hidden md:flex gap-5 flex-wrap">
                <ManagementStatistcsCard title="Call Request" newData={34} total={657} />
                <ManagementStatistcsCard title="Resolved" newData={34} total={657} />
                <ManagementStatistcsCard title="Unresolved" newData={34} total={657} />
            </div>
            <FilterBar azFilter exports isDateTrue onStateSelect={() => { }} pageTitle="calls request" aboutPageModalData={
                { title: "calls request", description: "This page contains a list of calls request on the platform." }
            } searchInputPlaceholder="Search for calls request" handleFilterApply={() => { }} filterOptions={[]} filterWithOptionsWithDropdown={reportsCallsFilterOptionsWithDropdown} />
            <CustomTable
                fields={fields}
                data={tableData}
                tableHeadClassName="bg-brand-9 h-[45px]"
                tableHeadCellSx={{
                    color: "#EFF6FF",
                    fontWeight: 500,
                    border: "none",
                    textAlign: "left",
                    fontSize: "14px",
                }}
                tableBodyCellSx={{
                    border: "none",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#050901",
                    fontSize: "14px",
                }}
                evenRowColor="#fff"
                oddRowColor="#FAFAFA"
            />
            <Pagination totalPages={2} currentPage={2} onPageChange={() => { }} />
        </div>
    );
};

export default Call;
