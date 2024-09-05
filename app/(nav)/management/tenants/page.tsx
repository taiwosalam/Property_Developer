"use client";
import { useState } from "react";
import Image from "next/image";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import TenantCard from "@/components/Management/landlord-and-tenant-card";
import type { TenantProps } from "@/components/Management/Tenants/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import type { Field } from "@/components/Table/types";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import { landlords as tenants } from "../data";
import SearchInput from "@/components/SearchInput/search-input";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";

const Tenants = () => {
  const initialState = {
    gridView: true,
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

  const onClickManage = (tenant: TenantProps) => {
    console.log("Manage clicked for:", tenant);
    // Add your logic here to manage the landlord
  };

  const onClickChat = (tenant: TenantProps) => {
    console.log("Chat clicked for:", tenant);
    // Add your logic here to chat with the landlord
  };

  const transformedTenants = tenants.map((t) => ({
    ...t,
    full_name: `${t.first_name} ${t.last_name}`,
    user_tag: <UserTag type={t.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full text-white [&>button]:rounded-[4px] [&>button]:capitalize">
        <button
          type="button"
          className="py-[8px] px-[32px] text-sm font-medium bg-brand-9"
          onClick={() => onClickManage(t)}
        >
          Manage
        </button>
        <button
          type="button"
          className="py-[8px] px-[32px] text-sm font-medium bg-brand-tertiary"
          onClick={() => onClickChat(t)}
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
      <section className="page-header-container">
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
        </div>
        <div className="lg:ml-auto">
          <Modal>
            <ModalTrigger asChild>
              <button type="button" className="page-header-button">
                + create new user
              </button>
            </ModalTrigger>
            <ModalContent>
              <AddTenantModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
      <div className="page-title-container">
        <h1 className="page-title">Tenants/Occupants (Users)</h1>
        <div className="flex items-center gap-x-4">
          <SearchInput
            placeholder="Search for Tenants & Occupants"
            className="bg-[#F1F2F4] w-[270px]"
            textInputClassName={`text-xs md:text-sm text-neutral-8 font-normal`}
            searchIconColor="#1E3A8A"
          />
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              aria-label="list-view"
              className={`${
                !gridView ? "bg-black text-white" : "bg-transparent text-black"
              } p-[4px] rounded-[4px]`}
              onClick={setListView}
            >
              <div className={!gridView ? "text-white" : "text-[unset]"}>
                <ListIcon />
              </div>
            </button>
            <button
              type="button"
              aria-label="grid-view"
              className={`${
                gridView ? "bg-black text-white" : "bg-transparent text-black"
              } p-[4px] rounded-[4px]`}
              onClick={setGridView}
            >
              <div className={gridView ? "text-white" : "text-[unset]"}>
                <GridIcon />
              </div>
            </button>
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
                <AddTenantModal />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
      <section>
        {gridView ? (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(284px, 1fr))",
            }}
          >
            {tenants.slice(0, 30).map((t) => (
              <TenantCard key={t.id} {...t} />
            ))}
          </div>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={fields}
            data={transformedTenants.slice(0, 20)}
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
          className="mt-8 text-xs font-medium"
        />
      </section>
    </div>
  );
};

export default Tenants;
