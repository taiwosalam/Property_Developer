import clsx from "clsx";
import { LandlordTenantInfoBox as InfoBox } from "@/components/Management/landlord-tenant-info-components";
import { SectionSeparator } from "@/components/Section/section-components";
import type { VehicleRecord } from "./types";
import Button from "@/components/Form/Button/button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import VehicleRecordModal from "./vehicle-record-modal";

const Detail: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1">
      <p className="text-[#747474] w-[120px]">{label}</p>
      <p className="text-black font-bold capitalize">{value}</p>
    </div>
  );
};

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
          <Detail label="Passengers In" value={checkIn.passenger} />
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
            <VehicleRecordModal {...record} showOpenRecordsButton={false} />
          </ModalContent>
        </Modal>
      </div>
    </InfoBox>
  );
};

export default PreviousRecord;
