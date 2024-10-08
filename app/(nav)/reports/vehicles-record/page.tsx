import React from "react";
import Link from "next/link";

// Images
import PdfIcon from "@/public/icons/pdf-icon.svg";
import ExcelIcon from "@/public/icons/excel-icon.svg";

// Imports
import Picture from "@/components/Picture/picture";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";

const VehicleRecord = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="page-title-container">
        <PageTitle title="Vehicles Record" />
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search for call requests" />
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <button>
              <div className="flex items-center gap-2 cursor-pointer">
                <Picture src="/icons/sliders.svg" alt="filters" size={20} />
                <p className="text-[#344054] text-base font-medium">Filters</p>
              </div>
            </button>
          </div>
          <Link
            href={""}
            className="flex items-center gap-2 py-[10px] px-4 rounded-lg border border-solid border-[#D0D5DD] bg-white"
          >
            <Picture src={PdfIcon} alt="pdf icon" size={20} />
            <p className="text-[#344054] text-base font-medium">Export</p>
          </Link>
          <Link
            href={""}
            className="flex items-center gap-2 py-[10px] px-4 rounded-lg border border-solid border-[#D0D5DD] bg-white"
          >
            <Picture src={ExcelIcon} alt="excel icon" size={20} />
            <p className="text-[#344054] text-base font-medium">Export</p>
          </Link>
        </div>
      </div>
      <div className="w-full pb-[120px] overflow-x-scroll no-scrollbar">
        <table className="dash-table">
          <colgroup>
            <col className="w-[50px]" />
          </colgroup>
          <thead>
            <tr>
              <th>S/N</th>
              <th>ID</th>
              <th>full name</th>
              <th>plate number</th>
              <th>Guest/Visitor</th>
              <th>check in</th>
              <th>check out</th>
              <th>passenger in</th>
              <th>passenger out</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <tr key={index}>
                  <td></td>
                  <td>
                    <p>02/03/2024</p>
                  </td>
                  <td>
                    <p>Amori Ademakinwa</p>
                  </td>
                  <td>
                    <p>1234567878</p>
                  </td>
                  <td>
                    <p>₦115,000.00</p>
                  </td>
                  <td>
                    <p>Property Rent for moniya house</p>
                  </td>
                  <td>
                    <p>Bank Transfer</p>
                  </td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleRecord;
