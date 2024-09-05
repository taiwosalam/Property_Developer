"use client";

// Imports
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import AddLandlordModal from "@/components/Management/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordCard from "@/components/Management/Landlord/landlord-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import type { LandlordProps } from "@/components/Management/Landlord/types";
import type { Field } from "@/components/Table/types";
import { landlords } from "../data";
import Input from "@/components/Form/Input/input";
import UserTag from "@/components/Tags/user-tag";
import Pagination from "@/components/Pagination/pagination";
import FilterModal from "@/components/Management/Landlord/filters-modal";

const Landlord = () => {
  const initialState = {
    gridView: false,
    total_pages: 50,
    current_page: 1,
  };
  const [state, setState] = useState(initialState);

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  const onClickManage = (landlord: LandlordProps) => {
    console.log("Manage clicked for:", landlord);
    // Add your logic here to manage the landlord
  };

  const onClickChat = (landlord: LandlordProps) => {
    console.log("Chat clicked for:", landlord);
    // Add your logic here to chat with the landlord
  };

  const landlordFilters = [
    { label: "Branch", value: "branch" },
    { label: "Account Officer", value: "Account Officer" },
    { label: "State", value: "state" },
    { label: "Alphabetically", value: "alphabetically" },
    { label: "Mobile Landlord", value: "mobile_landlord" },
    { label: "Web Landlord", value: "web_landlord" },
    { label: "Registration Date", value: "registration_date" },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const transformedLandlords = landlords.map((l) => ({
    ...l,
    full_name: `${l.first_name} ${l.last_name}`,
    user_tag: <UserTag type={l.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full text-white [&>button]:rounded-[4px] [&>button]:capitalize">
        <button
          type="button"
          className="py-[10px] px-2 lg:px-3 text-sm lg:text-base font-medium bg-brand-9"
          onClick={() => onClickManage(l)}
        >
          Manage
        </button>
        <button
          type="button"
          className="py-[10px] px-2 lg:px-3 text-sm lg:text-base font-medium bg-brand-tertiary"
          onClick={() => onClickChat(l)}
        >
          Chat
        </button>
      </div>
    ),
  }));

  const fields: Field[] = [
    {
      id: "1",
      accessor: "avatar",
      isImage: true,
      cellStyle: { paddingRight: "4px" },
    },
    {
      id: "2",
      accessor: "full_name",
      cellStyle: { paddingLeft: "4px", fontWeight: 700 },
    },
    {
      id: "3",
      accessor: "email",
      cellStyle: { fontWeight: 500, color: "#3F4247" },
    },
    {
      id: "4",
      accessor: "phone_number",
      cellStyle: { fontWeight: 500, color: "#3F4247" },
    },
    { id: "5", accessor: "user_tag" },
    { id: "6", accessor: "manage/chat" },
  ];

  const { gridView, total_pages, current_page } = state;

  return (
    <div className="space-y-9">
      <section className="w-full h-fit flex items-center justify-between gap-4">
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
        </div>
        <div className="lg:ml-auto">
          <Modal>
            <ModalTrigger asChild>
              <button type="button" className="page-header-button">
                + create new landlord
              </button>
            </ModalTrigger>
            <ModalContent>
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
      <div className="w-full flex items-center justify-between border-y-2 border-[#EAECF0] py-2 px-4">
        <div>
          <h1 className="text-md md:text-lg lg:text-xl xl:text-2xl font-bold text-black">
            Landlords/Landladies (Owners)
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <Input
              id="search"
              placeholder="Search for landlords"
              className="flex-1 max-w-[200px]"
              inputClassName={`text-xs md:text-sm`}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Image
              src="/icons/list-view.svg"
              alt="filter"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={setListView}
            />
            <Image
              src="/icons/grid-view.svg"
              alt="filter"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={setGridView}
            />
          </div>
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <Modal>
              <ModalTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src="/icons/sliders.svg"
                    alt="filter"
                    width={20}
                    height={20}
                  />
                  <p>Filters</p>
                </div>
              </ModalTrigger>
              <ModalContent>
                <FilterModal
                  filterOptions={landlordFilters}
                  onApply={handleFilterApply}
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
      <section>
        {gridView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
            {landlords.slice(0, 30).map((l) => (
              <LandlordCard key={l.id} {...l} />
            ))}
          </div>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={fields}
            data={transformedLandlords.slice(0, 20)}
            tableBodyCellSx={{
              fontSize: "16px",
              border: "none",
              textAlign: "left",
            }}
            evenRowColor="#fff"
            oddRowColor="#F1F2F4"
          />
        )}
        <Pagination
          totalPages={total_pages}
          currentPage={current_page}
          onPageChange={handlePageChange}
          className="mt-8 text-xs font-semibold"
        />
      </section>
    </div>
  );
};

export default Landlord;
