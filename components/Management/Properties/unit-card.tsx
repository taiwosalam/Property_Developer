// Images
import { CameraIcon } from "@/public/icons/icons";

// Imports
import { UnitCardProps } from "./types";
import { useState } from "react";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { Modal, ModalContent } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { useAddUnitStore } from "@/store/add-unit-store";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { deleteUnit } from "@/app/(nav)/management/properties/create-rental-property/[propertyId]/add-unit/data";
import { empty } from "@/app/config";
import { transformUnitDetails } from "@/app/(nav)/listing/data";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";
import { useModule } from "@/contexts/moduleContext";

const UnitCard: React.FC<UnitCardProps> = ({ data, setIsEditing, index }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const propertySettings = useAddUnitStore((state) => state.propertySettings);
  const removeUnit = useAddUnitStore((state) => state.removeUnit);
  const removeInstallmentUnit = useAddUnitStore(
    (state) => state.removeInstallmentUnit
  );
  const { activeModule, designVariant } = useModule();
  const isPropertyDeveloperModule = activeModule.id === "property_developer";
  const { role } = useRole();

  // PERMISSIONS
  const canAddOrDeleteBranchProperties =
    usePermission(role, "Can add/delete branch properties") ||
    role === "director";

  const currency = propertySettings?.currency || "naira";

  const referenceObject = isPropertyDeveloperModule
    ? {
        unit_details: "",
        "unit preference": "",
        unit_type: "",
        "unit sub_type": "",
        unit_price: "",
        first_deposit: "",
      }
    : {
        unit_details: "",
        "unit no/name": "",
        rent: "",
        ...(data.caution_fee ? { caution_deposit: "" } : {}),
        total_package: "",
        unit_type: "",
        service_charge: "",
        account_officer: "",
      };

  const keyValueData = isPropertyDeveloperModule
    ? {
        unit_details: transformUnitDetails(data),
        "unit preference": data.unit_preference,
        unit_type: data.unit_type,
        "unit sub_type": data.unit_sub_type,
        unit_price: `${currencySymbols[currency]}${formatNumber(
          parseFloat(data.initial_price)
        )}`,
        first_deposit: `${currencySymbols[currency]}${formatNumber(
          parseFloat(data.first_deposit)
        )}`,
      }
    : {
        unit_details: transformUnitDetails(data),
        "unit no/name": data.unit_name,
        rent: `${currencySymbols[currency]}${formatNumber(
          parseFloat(data.fee_amount)
        )}`,
        ...(data.caution_fee
          ? {
              caution_deposit: `${currencySymbols[currency]}${formatNumber(
                parseFloat(data.caution_fee)
              )}`,
            }
          : {}),
        total_package: `${currencySymbols[currency]}${formatNumber(
          parseFloat(data.total_package || "0")
        )}`,
        unit_type: data.unit_type,
        service_charge: `${currencySymbols[currency]}${formatNumber(
          parseFloat(data.service_charge || "0")
        )}`,
        account_officer: data.account_officer || "Not Assigned Yet",
      };


  const handleRemove = async () => {
    if (data.notYetUploaded) {
      if (isPropertyDeveloperModule) {
        removeInstallmentUnit(index);
      } else {
        removeUnit(index);
      }
    } else {
      setModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    const success = await deleteUnit(data.id);
    if (success) {
      removeUnit(index);
      setModalOpen(false);
    }
  };

  const hasImages = data.images.length > 0;
  const imageSrc = data.notYetUploaded
    ? empty // Use placeholder for unsaved units with no images
    : hasImages
    ? data.default_image || data.images[0].path
    : empty; // Fallback to placeholder if no images exist

  return (
    <>
      <div className="flex gap-4 flex-wrap items-center justify-between">
        <p
          className={`text-base font-bold ${
            data.notYetUploaded ? "text-red-500" : "text-brand-10"
          }`}
        >
          <span className="!text-brand-10">Unit ID:</span>{" "}
          {(data.notYetUploaded ? "Not Yet Updated!" : "") || data.id}
        </p>
        <div className="flex gap-4 sm:gap-8">
          <Button
            size="sm_medium"
            className="py-2 px-8"
            onClick={() => setIsEditing(true)}
          >
            edit
          </Button>
          {canAddOrDeleteBranchProperties && (
            <Button
              size="sm_medium"
              variant="light_red"
              className="py-2 px-8"
              onClick={handleRemove}
            >
              {data?.notYetUploaded ? "remove" : "delete"}
            </Button>
          )}
        </div>
      </div>
      <SectionSeparator />
      <div className="overflow-x-auto custom-round-scrollbar">
        <div className="min-w-[700px] flex py-4 items-center justify-between">
          <div className="flex-1 flex gap-6 flex-wrap">
            <KeyValueList
              data={keyValueData}
              referenceObject={referenceObject}
            />
          </div>
          {data.images.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden min-w-[168px] ml-4">
              <Picture
                src={imageSrc}
                // src={data.default_image || data.images[0].path}
                alt="property preview"
                size={168}
              />
              <div
                style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                className="absolute inset-0 custom-flex-col justify-between p-3"
              >
                {data.images.length > 1 && (
                  <div className="flex justify-end">
                    <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                      <CameraIcon />
                      <p className="text-black dark:text-white font-medium text-[10px]">
                        +{!data.notYetUploaded ? data.images.length - 1 : 0}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex justify-center mt-auto">
                  <Button
                    size="base_medium"
                    className="py-1 px-6"
                    onClick={() => setIsEditing(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <ModalPreset type="warning">
            <p className="text-text-disabled text-sm font-normal">
              Are you sure you want to proceed with deleting this unit from the
              property records?{" "}
              <span className="text-status-error-primary">*</span>Please note
              that you can only delete units without occupant records.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button
                type="button"
                size="base_medium"
                className="py-2 px-8"
                onClick={handleConfirmDelete}
              >
                proceed
              </Button>
              <button
                className="text-brand-primary text-sm font-medium"
                onClick={() => setModalOpen(false)}
              >
                Back
              </button>
            </div>
          </ModalPreset>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UnitCard;
