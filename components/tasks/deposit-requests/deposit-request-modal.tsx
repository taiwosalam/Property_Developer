"use client";
import { useState, useCallback, useEffect } from "react";
import type { LabelValuePairProps } from "../property-requests/types";
import { PointerDownSVG } from "@/public/icons/icons";
import type { DepositRequestModalProps } from "./types";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import {
  depositChecklist,
  IDepositPayload,
} from "@/app/(nav)/tasks/deposits/data";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { parseCurrencyToNumber } from "@/lib/utils";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";
import api, { handleAxiosError } from "@/services/api";
import { useModal } from "@/components/Modal/modal";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import { empty } from "@/app/config";
import PopupVideoModal from "@/components/VideoPlayer/PopupVideoModal";

dayjs.extend(utc);

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between font-medium">
      <p className="text-text-tertiary dark:text-darkText-1 text-base capitalize">
        {label}
      </p>
      <p className="text-text-secondary text-sm text-right dark:text-darkText-2 capitalize">
        {value}
      </p>
    </div>
  );
};

const DepositRequestModal: React.FC<DepositRequestModalProps> = ({
  requestId,
  propertyName,
  state,
  unitDetails,
  branch,
  amount,
  is_examine,
  is_inventory,
  is_maintain,
  inventory_at,
  inventory_by,
  examine_by,
  rejected_at,
  maintain_by,
  examined_at,
  maintain_at,
  created_at,
  status,
  request_from,
  refunded_amount,
  resolved_by,
  resolved_date,
  onDataUpdate,
  inventory,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingField, setUpdatingField] = useState<string | null>(null);
  const { role } = useRole();
  const { setIsOpen } = useModal();

  const [showImages, setShowImages] = useState(true);
  const [screenModal, setScreenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [videoModal, setVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const openModal = (index: number) => {
    if (!inventory) return;

    const selected = inventory[index];

    if (selected.isVideo) {
      setVideoUrl(selected.src);
      setVideoModal(true);
    } else {
      setCurrentIndex(index);
      setTimeout(() => {
        setScreenModal(true);
      }, 0);
    }
  };

  const imageOnly = (inventory ?? []).filter((img) => !img.isVideo);
  const adjustedIndex = imageOnly.findIndex(
    (img, i) => (inventory ?? []).indexOf(img) === currentIndex
  );

  const canApproveCautionDeposit =
    usePermission(role, "Can approve and refund caution deposit") ||
    role === "director";

  // State that syncs with props and gets updated from backend
  const [checkboxStates, setCheckboxStates] = useState({
    is_inventory: is_inventory || false,
    is_examine: is_examine || false,
    is_maintain: is_maintain || false,
  });

  // Metadata that gets updated from backend
  const [checkboxMetadata, setCheckboxMetadata] = useState({
    is_inventory: { by: inventory_by, at: inventory_at },
    is_examine: { by: examine_by, at: examined_at },
    is_maintain: { by: maintain_by, at: maintain_at },
  });

  const [refundAmount, setRefundAmount] = useState<number | undefined>(
    undefined
  );

  // Sync checkbox states when props change (after refetch)
  useEffect(() => {
    setCheckboxStates({
      is_inventory: is_inventory || false,
      is_examine: is_examine || false,
      is_maintain: is_maintain || false,
    });

    setCheckboxMetadata({
      is_inventory: { by: inventory_by, at: inventory_at },
      is_examine: { by: examine_by, at: examined_at },
      is_maintain: { by: maintain_by, at: maintain_at },
    });
  }, [
    is_inventory,
    is_examine,
    is_maintain,
    inventory_by,
    inventory_at,
    examine_by,
    examined_at,
    maintain_by,
    maintain_at,
  ]);

  // Create a stable callback for data updates
  const handleDataUpdate = useCallback(() => {
    if (onDataUpdate) {
      onDataUpdate();
    }
  }, [onDataUpdate]);

  // Silent API call without automatic event dispatching
  const updateCautionDepositSilent = useCallback(
    async (depositId: string, data: IDepositPayload) => {
      const payload = {
        refunded_amount: data?.refunded_amount,
        status: data?.status,
        is_examine: data?.is_examine,
        is_maintain: data?.is_maintain,
        is_inventory: data?.is_inventory,
      };

      try {
        const res = await api.patch(
          `cautions-deposit/company/${depositId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return res.status === 200 || res.status === 201;
      } catch (error) {
        console.error("API Error:", error);
        handleAxiosError(error);
        return false;
      }
    },
    []
  );

  const formattedRefundAmount =
    refundAmount !== undefined
      ? refundAmount.toLocaleString("en-NG", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "";

  const handleRefundAmountChange = useCallback((value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setRefundAmount(numericValue ? Number(numericValue) : undefined);
  }, []);

  const handleCheckboxChange = useCallback(
    async (field: keyof typeof checkboxStates) => {
      // Prevent changes if currently updating this field
      if (updatingField === field) {
        return;
      }

      // Prevent unchecking if already checked (based on your business logic)
      if (checkboxStates[field]) {
        toast.warning(
          "This item has already been completed and cannot be changed."
        );
        return;
      }

      const newCheckedState = true; // Always checking (not unchecking)
      setUpdatingField(field);

      // Optimistically update UI
      setCheckboxStates((prev) => ({
        ...prev,
        [field]: newCheckedState,
      }));

      const payload = {
        [field]: newCheckedState,
        status: "progress",
      };

      try {
        const success = await updateCautionDepositSilent(requestId, payload);

        if (success) {
          toast.success("Status updated successfully");
          handleDataUpdate();

          // The useEffect above will update the states when new data arrives
        } else {
          // Revert on failure
          setCheckboxStates((prev) => ({
            ...prev,
            [field]: !newCheckedState,
          }));
          toast.error("Failed to update status");
        }
      } catch (error) {
        // Revert on error
        setCheckboxStates((prev) => ({
          ...prev,
          [field]: !newCheckedState,
        }));
        toast.error("Failed to update status");
      } finally {
        setUpdatingField(null);
      }
    },
    [
      checkboxStates,
      updatingField,
      requestId,
      updateCautionDepositSilent,
      handleDataUpdate,
    ]
  );

  const handleDepositRequest = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!requestId) return;

      const allCheckboxesChecked = Object.values(checkboxStates).every(Boolean);
      if (!allCheckboxesChecked) {
        toast.warning(
          "All checkboxes must be checked before requesting a refund"
        );
        return;
      }

      if (!refundAmount) {
        toast.warning("You need to provide refund amount");
        return;
      }

      const depositAmount = parseCurrencyToNumber(amount);
      if (refundAmount > depositAmount) {
        toast.error("Refund amount is more than the deposit amount");
        return;
      }

      try {
        setIsLoading(true);
        const payload = {
          refunded_amount: refundAmount,
          status: request_from === "company" ? "completed" : "approved",
        };

        const success = await updateCautionDepositSilent(requestId, payload);

        if (success) {
          toast.success("Refund processed successfully");
          // Dispatch event for final completion
          setTimeout(() => {
            window.dispatchEvent(new Event("dispatchDeposit"));
          }, 100);
        } else {
          toast.error("Failed to process refund");
        }
      } catch (error) {
        console.error("Error processing refund:", error);
        toast.error("Failed to process refund");
      } finally {
        setIsLoading(false);
      }
    },
    [
      requestId,
      checkboxStates,
      refundAmount,
      amount,
      request_from,
      updateCautionDepositSilent,
    ]
  );

  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center w-full";

  const HoverContent = ({ field }: { field: keyof typeof checkboxStates }) => {
    const { by, at } = checkboxMetadata[field];

    if (!checkboxStates[field] || !at) return null;

    const formattedTime = dayjs(at).format("hh:mm A");
    const formattedDate = dayjs(at).format("DD/MM/YYYY");

    return (
      <div className="w-[250px] absolute bottom-full right-[12px] z-10 bg-brand-10 py-2 px-4 space-y-[10px] text-white text-sm font-normal">
        <p className="flex gap-2">
          <span>Approved by:</span>
          <span className="capitalize">{by?.toLowerCase() || "Unknown"}</span>
        </p>
        <p className="flex gap-2">
          <span>Date:</span>
          <span>{formattedDate}</span>
        </p>
        <p className="flex gap-2">
          <span>Time:</span>
          <span>{formattedTime}</span>
        </p>
        <div className="!m-0 absolute right-2 top-full text-brand-10">
          <PointerDownSVG />
        </div>
      </div>
    );
  };

  const checklistMapping: Record<
    string,
    { field: keyof typeof checkboxStates; label: string }
  > = {
    "check inventory": {
      field: "is_inventory",
      label:
        checkboxStates.is_inventory &&
        (status === "completed" || status === "progress")
          ? "Checked inventory"
          : "check inventory",
    },
    "request for examine": {
      field: "is_examine",
      label:
        checkboxStates.is_examine &&
        (status === "completed" || status === "progress")
          ? "Done with examine"
          : "request for examine",
    },
    "request for maintenance": {
      field: "is_maintain",
      label:
        checkboxStates.is_maintain &&
        (status === "completed" || status === "progress")
          ? "Done with maintenance"
          : "request for maintenance",
    },
  };

  return (
    <ModalPreset title="Caution Deposit Request">
      <div className="pb-[45px] text-base">
        <div className="space-y-2">
          <LabelValuePair label="ID" value={requestId} />
          <LabelValuePair label="Property Name" value={propertyName} />
          <LabelValuePair label="Location (State)" value={state} />
          <LabelValuePair label="Unit Details" value={unitDetails} />
          <LabelValuePair label="Branch" value={branch} />
          <LabelValuePair label="Deposit Amount" value={amount} />

          {(status === "completed" || status === "approved") && (
            <div className="space-y-2">
              <LabelValuePair
                label="Amount Refunded"
                value={refunded_amount || "--- ---"}
              />
              <LabelValuePair
                label="Resolved By"
                value={resolved_by || "--- ---"}
              />
              <LabelValuePair
                label="Resolved Date"
                value={resolved_date || "--- ---"}
              />
            </div>
          )}
        </div>

        <div className="border-t border-brand-7 my-5 -mx-6 border-dashed" />

        <form className="space-y-4" onSubmit={handleDepositRequest}>
          <div className="flex justify-between items-center">
            <p className="text-text-tertiary dark:text-white">
              Caution Deposits Details:
            </p>

            {is_inventory && <Button className="py-1 font-normal px-2" onClick={() =>setScreenModal(true)}>View inventory</Button>}
          </div>

          <div className="space-y-2 relative">
            {depositChecklist.map((deposit, index) => {
              const fieldKey = checklistMapping[deposit].field;
              const isFieldUpdating = updatingField === fieldKey;
              const isChecked = checkboxStates[fieldKey];

              return (
                <Checkbox
                  key={`${deposit}-${index}`}
                  id={`${deposit}-${requestId}`}
                  name={fieldKey}
                  className={commonClasses}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(fieldKey)}
                  disabled={isFieldUpdating} // Disable if updating or already checked
                  hoverContent={<HoverContent field={fieldKey} />}
                >
                  {isFieldUpdating
                    ? "Please wait..."
                    : checklistMapping[deposit].label}
                </Checkbox>
              );
            })}
          </div>

          {((role === "manager" && canApproveCautionDeposit) ||
            role === "director") &&
            (status === "pending" || status === "progress") && (
              <div className="space-y-5">
                <div className="flex gap-1 items-center">
                  <p className="text-red-500">*</p>
                  <p className="text-text-tertiary dark:text-white">
                    Caution deposit held in escrow by the{" "}
                    {request_from === "company"
                      ? "Management Company"
                      : request_from === "landlord"
                      ? "Landlord/Landlady"
                      : request_from === "escrow"
                      ? "Administrator"
                      : "Management Company"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
                  <Input
                    id="refund_amount"
                    label="Amount to be Refunded"
                    CURRENCY_SYMBOL="₦"
                    formatNumber
                    value={formattedRefundAmount}
                    onChange={handleRefundAmountChange}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="xs_normal"
                    className="py-2 px-6"
                    disabled={isLoading || updatingField !== null}
                  >
                    {isLoading ? "Processing..." : "Refund Now"}
                  </Button>
                </div>
              </div>
            )}
        </form>
      </div>

      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={imageOnly}
        currentIndex={adjustedIndex}
      />

      <PopupVideoModal
        isOpen={videoModal}
        videoUrl={videoUrl}
        onClose={() => setVideoModal(false)}
      />
    </ModalPreset>
  );
};

export default DepositRequestModal;
