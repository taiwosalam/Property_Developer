// Types
import type { InspectionCardProps } from "./types";

// Images
import ChatIcon from "@/public/icons/chat.svg";

// Imports
import clsx from "clsx";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import InspectionCardInfo from "./inspection-card-info";
import InspectionCardDetail from "./inspection-card-detail";
import InspectionDetailModal from "./inspection-detail-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import useFetch from "@/hooks/useFetch";
import {
  Inspection,
  InspectionDetailsApiResponse,
} from "@/app/(nav)/tasks/inspections/type";
import { useEffect, useState } from "react";
import { formatTime } from "@/app/(nav)/notifications/data";
import {
  TInspectionDetails,
  transformInspectionDetails,
} from "@/app/(nav)/tasks/inspections/data";
import { useRouter } from "next/navigation";

const InspectionCard: React.FC<InspectionCardProps> = ({ data }) => {
  const { data: inspectionData } = useFetch<InspectionDetailsApiResponse>(
    `inspections/${data?.id}`
  );
  const [inspection, setInspection] = useState<TInspectionDetails | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (inspectionData) {
      const transformedData = transformInspectionDetails(inspectionData);
      setInspection(transformedData);
    }
  }, [inspectionData]);

  return (
    <div
      className="rounded-lg bg-white dark:bg-darkText-primary custom-flex-col gap-6 pb-6"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-3">
        {data && (
          <InspectionCardInfo
            className="p-[18px]"
            address={data?.address}
            image={data?.images}
            unit_fee_period={data?.unit_fee_amount}
            title={data?.property_name}
            total_price={data?.total_package}
            yearly_price={data?.fee_amount}
          />
        )}
        <div className="py-2 px-[18px] bg-brand-1 flex justify-between text-base font-medium">
          <p className="text-text-secondary">Inspection details</p>
          <p
            className={clsx("capitalize", {
              "text-support-2": data?.inspection_type === "virtual_inspection",
              "text-support-3": data?.inspection_type === "physical_inspection",
            })}
          >
            {data?.inspection_type === "physical_inspection"
              ? "Physical Inspection"
              : "Virtual Inspection"}
          </p>
        </div>
      </div>
      <div className="custom-flex-col gap-8 px-[18px]">
        <div className="flex justify-between gap-2 capitalize">
          {data && (
            <InspectionCardDetail
              title="Booked by"
              desc={data?.booked_by}
              verirified={data?.tier ? true : false}
              tier={data?.tier}
            />
          )}
          {data && (
            <InspectionCardDetail
              title="Inspection Date"
              desc={data?.inspection_date}
            />
          )}
          {data && (
            <InspectionCardDetail
              title="Inspection Time"
              desc={formatTime(data?.inspection_time)}
            />
          )}
        </div>
        <div className="flex items-center gap-4 justify-end">
          <button onClick={() => router.push("/messages")}>
            <Picture src={ChatIcon} alt="chat" size={24} />{" "}
          </button>
          <Modal>
            <ModalTrigger asChild>
              <Button size="xs_normal" className="py-2 px-6">
                more details
              </Button>
            </ModalTrigger>
            <ModalContent>
              {inspection && <InspectionDetailModal data={inspection} />}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default InspectionCard;
