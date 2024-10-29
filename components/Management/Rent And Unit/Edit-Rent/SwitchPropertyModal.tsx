import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { DeleteIconX } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import React from "react";

const SwitchPropertyModal = () => {
  const router = useRouter();
  return (
    <div>
      <ModalPreset type="warning" className="w-full min-w-[360px]">
        <div className="flex flex-col gap-11">
          <div className="flex flex-col gap-10">
            <p className="text-text-tertiary text-[14px]">
              Are you sure you want to proceed with moving the tenant&apos;s
              records from the current unit to another unit of another property?
            </p>
            <div className="flex flex-col gap-2">
              <Modal>
                <ModalTrigger asChild>
                  <Button>OK</Button>
                </ModalTrigger>
                <ModalContent>
                  <div className="w-[700px] max-w-[80%] max-h-[50vh] h-full rounded-[20px] bg-white overflow-y-auto custom-round-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
                      <div className="flex items-center gap-2">
                        <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
                          Add Property ID
                        </p>
                      </div>
                      <ModalTrigger
                        close
                        className="p-2"
                        type="button"
                        aria-label="close"
                      >
                        <DeleteIconX size={34} />
                      </ModalTrigger>
                    </div>
                    {/* body */}
                    <div className="flex items-center justify-center my-auto">
                      <div className="mt-28 space-y-5">
                        <Select
                          id="dfsjhgv"
                          label="Choose Property"
                          className="min-w-[300px]"
                          options={[
                            { value: "1", label: "Option 1" },
                            { value: "2", label: "Option 2" },
                            { value: "3", label: "Option 3" },
                          ]}
                        />
                        <div className="w-full flex items-center justify-center">
                          <Button
                            onClick={() => {
                              router.push(
                                "/management/rent-unit/edit-rent/change-property"
                              );
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalContent>
              </Modal>
              <ModalTrigger asChild close>
                <Button variant="blank" className="text-brand-9">
                  Back
                </Button>
              </ModalTrigger>
            </div>
          </div>
        </div>
      </ModalPreset>
    </div>
  );
};

export default SwitchPropertyModal;
