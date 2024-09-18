import React from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import Image from "next/image";
import CloseCircle from "@/public/icons/close-circle.svg";

const RelocateModal = () => {
  return (
    <div className="w-[500px] max-w-[90%] rounded-[10px] bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-success-1 px-4 py-3">
        <div className="flex items-center justify-between">
          <span></span>
          <ModalTrigger close className="p-1" type="button">
            <Image src={CloseCircle} alt="close" width={24} height={24} />
          </ModalTrigger>
        </div>
        <h2 className="text-lg font-semibold text-center">Relocate</h2>
      </div>
      {/* Body */}
      <div className="px-4 py-6">
        <p className="text-sm mb-6 h-[200px]">
          Your actions indicate that the occupant have already relocated from
          the current unit of the estate. If you proceed, you will lose unit
          data.
        </p>
        <button
          className="w-full bg-red-100 text-red-500 py-2 rounded text-sm font-medium"
          onClick={() => {
            /* Handle move out action */
          }}
        >
          Move Out
        </button>
      </div>
    </div>
  );
};

export default RelocateModal;
