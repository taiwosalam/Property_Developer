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
} from "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/inspections/type";
import { useEffect, useState } from "react";
import { formatTime } from "@/app/(nav)/notifications/data";
import {
  TInspectionDetails,
  transformInspectionDetails,
} from "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/inspections/data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { useGlobalStore } from "@/store/general-store";
import { empty } from "@/app/config";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const InspectionCard: React.FC<InspectionCardProps> = ({ data }) => {
  const { role } = useRole();
  // PERMISSIONS
  const canManageInspection = usePermission(role, "Can manage inspections");

  const { data: inspectionData, refetch } =
    useFetch<InspectionDetailsApiResponse>(`inspections/${data?.id}`);
  const [inspection, setInspection] = useState<TInspectionDetails | null>(null);
  const router = useRouter();

  useRefetchOnEvent("dispatchInspection", () => refetch({ silent: true }));

  const [isOpen, setIsOpen] = useState(false);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  useEffect(() => {
    if (inspectionData) {
      const transformedData = transformInspectionDetails(inspectionData);
      setInspection(transformedData);
    }
  }, [inspectionData]);

  const goToMessage = () => {
    if (!data?.booked_by_id) {
      toast.warning("User ID not Found!");
      return;
    }

    // Set the user data in the global store
    const newMessageUserData = {
      branch_id: 0,
      id: data?.booked_by_id,
      imageUrl: data?.profile_picture,
      name: data?.user_name || "Unknown User",
      position: "agent",
    };
    setGlobalStore("messageUserData", newMessageUserData);

    // Redirect to the messaging page
    router.push(`/messages/${data?.booked_by_id}`);
  };

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

          <p className="text-text-secondary">
            Status:{" "}
            <span
              className={`${inspection?.is_application
                ? "text-green-500"
                : "text-yellow-500"
                }`}
            >
              {inspection?.is_application ? "Inspected" : "Pending"}
            </span>
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
          <button
            onClick={goToMessage}
            type="button"
            aria-label="Message"
            className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
          >
            Message
          </button>
          <Modal
            state={{
              setIsOpen,
              isOpen,
            }}
          >
            <ModalTrigger asChild>
              <Button size="xs_normal" className="py-2 px-6">
                more details
              </Button>
            </ModalTrigger>
            <ModalContent>
              {inspection && (
                <InspectionDetailModal
                  hideCard
                  data={inspection}
                  setIsOpen={setIsOpen}
                />
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default InspectionCard;
