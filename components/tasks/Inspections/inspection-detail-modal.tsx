import React, { useState } from "react";

// Imports
import { ModalTrigger } from "@/components/Modal/modal";
import InspectionCardInfo from "./inspection-card-info";
import {
  InspectionCardDesc,
  InspectionCardTitle,
  InspectionCardTitleDesc,
} from "./inspection-card-components";
import Button from "@/components/Form/Button/button";
import { CancelIcon } from "@/public/icons/icons";
import { Inspection } from "@/app/(nav)/tasks/inspections/type";
import {
  formatToNaira,
  requestApplication,
  TInspectionDetails,
} from "@/app/(nav)/tasks/inspections/data";
import { formatTime } from "@/app/(nav)/notifications/data";
import { useRouter } from "next/navigation";
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import { toast } from "sonner";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

interface InspectionDetailsModelProps {
  data: TInspectionDetails;
  setIsOpen?: (val: boolean) => void;
}
const InspectionDetailModal = ({
  data,
  setIsOpen,
}: InspectionDetailsModelProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole();
  // PERMISSIONS
  const canManageInspection =
    usePermission(role, "Can manage inspections") || role === "director";

  const getBadgeColor = (tier?: number): BadgeIconColors => {
    if (!tier) return "blue";
    return tierColorMap[tier as keyof typeof tierColorMap] || "";
  };

  console.log(data);

  const gotoMessage = () => {
    if (!data.userId) {
      toast.warning("User ID is missing");
      router.push("/messages");
    }
    router.push(`/messages/${data.userId}`);
  };

  const handleRequestApplication = async () => {
    if (!data?.id) return;
    try {
      setIsLoading(true);
      const res = await requestApplication(data?.id.toString());
      if (res) {
        toast.success("Inspection marked as inspected successfully.");
        setIsOpen?.(false);
        window.dispatchEvent(new Event("dispatchInspection"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="w-[600px] max-w-[80%] max-h-[90vh] rounded-lg bg-white dark:bg-darkText-primary custom-flex-col pb-14 gap-6 overflow-x-hidden overflow-y-auto custom-round-scrollbar"
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40) dark:border-darkText-1",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="sticky top-0 z-[2] custom-flex-col gap-[2px] py-4 px-6 bg-brand-1 dark:bg-[#3C3D37]">
        <div className="flex justify-end">
          <ModalTrigger close>
            <CancelIcon />
          </ModalTrigger>
        </div>
        <h2 className="text-text-secondary dark:text-white text-base font-medium text-center">
          Inspection details
        </h2>
      </div>
      <InspectionCardInfo
        className="px-6"
        address={data?.address}
        unit_fee_period={data?.unit_fee_amount}
        total_price={data?.total_package}
        image={data?.images || []}
        title={data?.property_name}
        yearly_price={data?.fee_amount}
      />

      <div className="relative z-[1] custom-flex-col gap-4">
        <div className="w-full border-b border-dashed border-brand-7 opacity-50"></div>
        <div className="custom-flex-col gap-8 px-6">
          <div className="custom-flex-col gap-4">
            <InspectionCardTitle>other details</InspectionCardTitle>
            <InspectionCardTitleDesc
              title="Booked by"
              desc={
                <div className="flex items-center">
                  <span>{data?.booked_by}</span>
                  {data?.tier && (
                    <BadgeIcon color={getBadgeColor(data?.tier)} />
                  )}
                </div>
              }
            />
            <InspectionCardTitleDesc
              title="Selected Date"
              desc={data?.inspection_date}
            />
            <InspectionCardTitleDesc
              title="Selected Time"
              desc={data?.inspection_time}
            />
            <InspectionCardTitleDesc title="Phone" desc={data?.phone} />
            <InspectionCardTitleDesc
              title="Branch"
              desc={data?.branch_name ?? ""}
            />
            <InspectionCardTitleDesc title="Property" desc={data?.property} />
            <InspectionCardTitleDesc
              title="Inspection Type"
              desc={
                data?.inspection_type === "physical_inspection"
                  ? "Physical Inspection"
                  : "Virtual Inspection"
              }
            />
            <div className="custom-flex-col gap-1">
              <InspectionCardTitle>client brief</InspectionCardTitle>
              <InspectionCardDesc>{data?.description}</InspectionCardDesc>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            {canManageInspection && (
              <>
                {!data?.is_application ? (
                  <Button
                    variant="sky_blue"
                    size="xs_normal"
                    className="py-2 px-6"
                    disabled={isLoading}
                    onClick={handleRequestApplication}
                  >
                    {isLoading ? "Please wait..." : "Mark As Inspected"}
                  </Button>
                ) : (
                  <Button
                    variant="sky_blue"
                    size="xs_normal"
                    className="py-2 px-6 cursor-default"
                    disabled={isLoading}
                  >
                    {"Inspected"}
                  </Button>
                )}
              </>
            )}
            <Button
              size="xs_normal"
              className="py-2 px-6"
              onClick={gotoMessage}
            >
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetailModal;
