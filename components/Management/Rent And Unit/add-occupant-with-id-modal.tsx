"use client";

import Image from "next/image";
import { ModalTrigger } from "@/components/Modal/modal";
// Images
import CloseCircle from "@/public/icons/close-circle.svg";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";

const AddOccupantWithId = () => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] rounded-[20px] bg-white overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
        <div className="flex items-center gap-2">
          <span></span>
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            Add occupant with ID
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button">
          <Image
            src={CloseCircle}
            alt="close"
            width={34}
            height={34}
            className="min-w-[34px] min-h-[34px]"
          />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="px-[30px] pt-10 pb-[44px] md:pb-[56px]">
        <form className="flex justify-center" onSubmit={() => {}}>
          <div className="custom-flex-col gap-5 w-[300px]">
            <Input
              id="profile_id"
              label="Input Occupant ID"
              inputClassName="rounded-[8px]"
            />
            <div className="flex justify-center">
              <Button type="submit" size="base_medium" className="py-2 px-8">
                invite
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOccupantWithId;
