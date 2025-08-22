"use client";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import SMSModal, { type SMSRecord } from "@/components/reports/sms-modal";
import { Modal, ModalContent } from "@/components/Modal/modal";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { reportsSmsFilterOptionsWithDropdown, smsTableFields } from "./data";
import useFetch from "@/hooks/useFetch";
import EmptyList from "@/components/EmptyList/Empty-List";

const SMSReport = () => {
  const [smsData, setSMSData] = useState();
  const {
    data: apiData,
    loading,
    error,
    isNetworkError,
  } = useFetch("/record/sms");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<SMSRecord | null>(null);

  const handleTableItemClick = (record: DataItem) => {
    setSelectedSMS(record as SMSRecord);
    setModalOpen(true);
  };

  /// console.log(apiData);

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      user_id: `User ${index + 1}`,
      client_name: `Client ${index + 1}`,
      phone_number: `Phone ${index + 1}`,
      date: "12/12/12",
      time: "3:20pm",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total SMS"
          newData={23}
          total={200}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        isDateTrue
        pageTitle="SMS"
        aboutPageModalData={{
          title: "sms",
          description: "This page contains a list of sms on the platform.",
        }}
        searchInputPlaceholder="Search for sms"
        handleFilterApply={() => {}}
        filterOptionsMenu={reportsSmsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/sms/export"
      />
      {[].length > 0 ? (
        <CustomTable
          fields={smsTableFields}
          data={tableData}
          tableHeadClassName="h-[45px]"
          handleSelect={handleTableItemClick}
        />
      ) : (
        <section>
          <EmptyList
            noButton
            title="No SMS Information Available Yet"
            body={
              <p>
                There are currently no SMS records to export. This section will
                automatically update with SMS messages sent to your company
                users using your company name. These messages are typically
                triggered by rent-related activities or other actions carried
                out through the platform. Once activity begins, all relevant SMS
                logs will appear here.
              </p>
            }
          />
        </section>
      )}

      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <SMSModal {...(selectedSMS as SMSRecord)} />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SMSReport;
