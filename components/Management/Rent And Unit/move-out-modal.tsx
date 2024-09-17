import React from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import Image from "next/image";
import CloseCircle from "@/public/icons/close-circle.svg";

const MoveOutModal = () => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] rounded-[20px] bg-white overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
        <div className="flex items-center gap-2">
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            Move out
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
      <div className="px-[30px] pt-6 pb-[30px]">
        <p className="text-sm mb-6">
          Your actions indicate that the tenants have already moved out from the
          current unit of the property, and the said unit is now available for
          listing to other potential tenants. If you proceed, you will lose unit
          data, and the tenants will await caution deposit approval.
        </p>
        <div>
          <h3 className="font-semibold mb-4">Caution Deposit Requirement</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="check-inventory">Check Inventory</label>
              <input type="checkbox" id="check-inventory" className="mr-2" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="create-examine">Create Examine</label>
              <input type="checkbox" id="create-examine" className="mr-2" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="create-maintenance">Create Maintenance</label>
              <input type="checkbox" id="create-maintenance" className="mr-2" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="flag-tenant">Flag Tenant</label>
              <input type="checkbox" id="flag-tenant" className="mr-2" />
            </div>
          </div>
        </div>
        <button className="w-full bg-red-100 text-red-500 py-2 rounded mt-6">
          Move Out
        </button>
      </div>
    </div>
  );
};

export default MoveOutModal;
