"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import ExportButton from "@/components/reports/export-button";
import Pagination from "@/components/Pagination/pagination";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";

const Visitors = () => {
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
        { id: "6", label: "Visitor", accessor: "visitor" },
        { id: "7", label: "Date", accessor: "date" },
        { id: "8", label: "Check In", accessor: "check_in" },
        { id: "9", label: "Check Out", accessor: "check_out" },
        { id: "9", label: "", accessor: "action" },
    ];

    const generateTableData = (numItems: number) => {
        return Array.from({ length: numItems }, (_, index) => ({
            id: '123456789',
            branch: 'Akinyele Branch',
            property_name: 'Property Name',
            requester: 'Ajayi David',
            visitor: 'Ajayi David',
            date: '12/02/2024',
            check_in: '08:30am',
            check_out: '08:30am',
        }));
    };

    const tableData = generateTableData(10);

    return (
        <div className="space-y-9">
            <div className="hidden md:flex gap-5 flex-wrap">
                <ManagementStatistcsCard title="Visitors Request" newData={34} total={657} />
                <ManagementStatistcsCard title="Checked In Visitors" newData={34} total={657} />
                <ManagementStatistcsCard title="Check Out Visitors" newData={34} total={657} />
            </div>
            <div className="page-title-container">
                <PageTitle title="Visitors Request" />
                <div className="flex items-center gap-4 flex-wrap">
                    <SearchInput placeholder="Search for visitors request" />
                    <FilterButton />
                    <ExportButton type="pdf" />
                    <ExportButton type="csv" />
                </div>
            </div>
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

export default Visitors;
