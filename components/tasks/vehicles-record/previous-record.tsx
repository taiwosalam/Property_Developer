import clsx from "clsx";
import { LandlordTenantInfoBox as InfoBox } from "@/components/Management/landlord-tenant-info-components";
import { SectionSeparator } from "@/components/Section/section-components";
import Button from "@/components/Form/Button/button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import VehicleRecordModal from "./vehicle-record-modal";
import { useEffect, useState } from "react";
import { formatDate } from "@/app/(nav)/tasks/agent-community/property-request/data";
import { format_date_time } from "@/app/(nav)/tasks/vehicles-record/data";

interface checkInOutData {
  id: number;
  check_in_time: string;
  in_by: string;
  passengers_in: number;
  check_out_time: string;
  out_by: string;
  passengers_out: string;
  status: string;
  inventory_in: string;
  inventory_out: string;
  inventory_id: number;
  category?: string;
  plate_number?: string;
  last_update?: string;
  vehicle_record_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  latest_check_in?: Object;
}

const Detail: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1">
      <p className="text-[#747474] dark:text-darkText-1 w-[120px]">
        {label}
      </p>
      <p className="text-black dark:text-white font-bold capitalize">
        {value}
      </p>
    </div>
  );
};

const PreviousRecord: React.FC<checkInOutData & { pictureSrc: string, category?: string, userId?: number, registrationDate?: string }> = (props) => {
  const { pictureSrc, category, userId, registrationDate, ...record } = props;
  const [status, setStatus] = useState<string>("");
  const [recordData, setRecordData] = useState<checkInOutData>(record);


  const checkIn = {
    date: formatDate(recordData.check_in_time),
    name: recordData.in_by,
    passenger: recordData.passengers_in,
    inventory: recordData.inventory_in,
  }

  const checkOut = {
    date: formatDate(recordData.check_out_time),
    name: recordData.out_by,
    passenger: recordData.passengers_out,
    inventory: recordData.inventory_out,
  }

  console.log("recordData", recordData);

  return (
    <InfoBox>
      <div className="flex gap-2 items-center justify-between">
        <p className="text-brand-5 font-bold text-base">ID: {record?.id?.toString() || ""}</p>
        <p
          className={clsx(
            "p-2 font-normal text-xs border capitalize",
            status === "completed"
              ? "bg-status-success-1 border-status-success-1 text-status-success-2"
              : "bg-status-caution-1 border-status-caution-1 text-status-caution-2"
          )}
        >
          {status}
        </p>
      </div>
      <SectionSeparator className="mt-5 mb-4" />
      <div className="flex gap-4 lg:gap-16 flex-wrap text-sm lg:text-base font-normal capitalize">
        <div className="grid gap-y-4 gap-x-8 grid-cols-2 lg:grid-cols-3">
          <Detail label="Check In" value={checkIn.date} />
          <Detail label="Check In by" value={checkIn.name} />
          <Detail label="Passengers In" value={checkIn.passenger.toString()} />
          <Detail label="Check Out" value={checkOut?.date || "---"} />
          <Detail label="Check Out by" value={checkOut?.name || "---"} />
          <Detail
            label="Passengers Out"
            value={checkOut?.passenger || "---"}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-8 ml-auto self-end">
              Preview
            </Button>
          </ModalTrigger>
          <ModalContent>
            <VehicleRecordModal 
                status={status as "completed" | "pending"}
                pictureSrc={pictureSrc}
                name={checkIn.name}
                id={recordData?.inventory_id?.toString() || userId?.toString() || ""}
                category={category as "guest" | "visitor"}
                registrationDate={format_date_time(registrationDate || "")}
                latest_check_in={recordData}
                showOpenRecordsButton={false}
                plate_number={recordData?.plate_number || ""}
                last_update={recordData?.last_update || ""}
              />
          </ModalContent>
        </Modal>
      </div>
    </InfoBox>
  );
};

export default PreviousRecord;
