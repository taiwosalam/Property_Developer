"use client";
import Button from "@/components/Form/Button/button";
import { EstateDetailItem } from "./detail-item";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useRouter } from "next/navigation";

const EstateSettings = ({
  title,
  estateSettingsDta,
  gridThree,
}: {
  title?: string;
  estateSettingsDta: { label: string; value: string }[];
  gridThree?: boolean;
}) => {
  const router = useRouter();
  return (
    <div
      className="py-6 px-6 bg-white dark:bg-darkText-primary rounded-md space-y-4"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
        {!title ? "Estate Settings" : title}
      </h6>
      <div className="w-5/6 h-[1px] bg-[#C0C2C8] bg-opacity-20"></div>
      <div className="w-full flex items-center justify-between">
        <div
          className={`grid grid-cols-1 ${
            gridThree ? "xl:grid-cols-3" : "xl:grid-cols-2"
          } gap-y-4 w-5/6`}
        >
          {estateSettingsDta.map((item, index) => (
            <EstateDetailItem
              key={index}
              label={item.label}
              value={item.value}
              style={{ width: "120px" }}
            />
          ))}
          <div className="xl:hidden">
            <Modal>
              <ModalTrigger asChild>
                <Button type="submit" className="py-2 px-8" onClick={() => {}}>
                  Edit
                </Button>
              </ModalTrigger>
            </Modal>
          </div>
        </div>
        <div className="hidden xl:block">
          <Modal>
            <ModalTrigger asChild>
              <Button type="submit" className="py-2 px-8" onClick={() => {}}>
                Edit
              </Button>
            </ModalTrigger>
            <ModalContent>
              <div className="bg-white py-10 absolute bottom-0 left-0 right-0">
                <p className="text-center font-semibold my-4 text-brand-9">
                  This action will navigate you away from the Rent and Unit menu
                  to another menu. You can choose to continue or exit from the
                  process
                </p>
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-between space-x-10">
                    <Button
                      type="submit"
                      className="py-2 px-8"
                      size="16_bold"
                      onClick={() => {
                        router.push("/management/properties/1/edit-property");
                      }}
                    >
                      Proceed
                    </Button>
                    <ModalTrigger asChild close>
                      <Button
                        type="submit"
                        className="py-2 px-8"
                        size="16_bold"
                      >
                        Exit
                      </Button>
                    </ModalTrigger>
                  </div>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default EstateSettings;
