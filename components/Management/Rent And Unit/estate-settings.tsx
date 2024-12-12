"use client";
import Button from "@/components/Form/Button/button";
import { EstateDetailItem } from "./detail-item";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import EditWarningModal from "./edit-warning-modal";
import { RentSectionTitle } from "./rent-section-container";

const EstateSettings = ({
  title,
  estateSettingsDta,
  gridThree,
}: {
  title: string;
  estateSettingsDta: { label: string; value?: string }[];
  gridThree?: boolean;
}) => {
  return (
    <div
      className="py-6 px-6 bg-white dark:bg-darkText-primary rounded-md space-y-4"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <RentSectionTitle>{title}</RentSectionTitle>
      <div className="h-[1px] bg-[#C0C2C8] bg-opacity-20" />
      <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:justify-between">
        <div
          className={`flex-1 grid gap-y-4 gap-x-2 md:grid-cols-2 ${
            gridThree ? "lg:grid-cols-3" : "lg:max-w-fit"
          }`}
        >
          {estateSettingsDta.map((item, index) => (
            <EstateDetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "150px" }}
            />
          ))}
        </div>
        <div className="w-fit ml-auto">
          <Modal>
            <ModalTrigger asChild>
              <Button size="base_medium" className="py-2 px-6">
                Edit
              </Button>
            </ModalTrigger>
            <ModalContent>
              <EditWarningModal />
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default EstateSettings;
