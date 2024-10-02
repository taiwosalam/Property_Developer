import clsx from "clsx";
import { LandlordTenantInfoBox as InfoBox } from "@/components/Management/landlord-tenant-info-components";
import { SectionSeparator } from "@/components/Section/section-components";
import type { VehicleRecord } from "./types";
import Button from "@/components/Form/Button/button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import VehicleRecordModal from "./vehicle-record-modal";

const PreviousRecord: React.FC<VehicleRecord> = (record) => {
  const { status, checkIn, checkOut } = record;
  return (
    <InfoBox>
      <div className="flex gap-2 items-center justify-between">
        <p className="text-brand-5 font-bold text-base">ID: 123456</p>
        <p
          className={clsx(
            "p-2 font-normal text-xs border capitalize",
            status === "completed"
              ? "bg-success-1 border-success-1 text-success-2"
              : "bg-status-caution-1 border-status-caution-1 text-status-caution-2"
          )}
        >
          {status}
        </p>
      </div>
      <SectionSeparator className="mt-5 mb-4" />
      <div className="flex gap-16 text-sm lg:text-base font-normal capitalize">
        <div className="flex gap-6">
          <div className="custom-flex-col gap-4 [&>p]:text-[#747474]">
            <p>Check In</p>
            <p>Check Out</p>
          </div>
          <div className="custom-flex-col gap-4 [&>p]:text-black font-bold">
            <p>{checkIn.date}</p>
            <p>{checkOut?.date ? checkOut.date : "--"}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="custom-flex-col gap-4 [&>p]:text-[#747474]">
            <p>Checked In by</p>
            <p>Checked Out by</p>
          </div>
          <div className="custom-flex-col gap-4 [&>p]:text-black font-bold">
            <p>{checkIn.name}</p>
            <p>{checkOut?.name ? checkOut.name : "--"}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="custom-flex-col gap-4 [&>p]:text-[#747474]">
            <p>Passengers In</p>
            <p>Passengers Out</p>
          </div>
          <div className="custom-flex-col gap-4 [&>p]:text-black font-bold">
            <p>{checkIn.passenger}</p>
            <p>{checkOut?.passenger ? checkOut.passenger : "--"}</p>
          </div>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-8 ml-auto self-end">
              Preview
            </Button>
          </ModalTrigger>
          <ModalContent>
            <VehicleRecordModal {...record} showOpenRecordsButton={false} />
          </ModalContent>
        </Modal>
      </div>
    </InfoBox>
  );
};

export default PreviousRecord;
