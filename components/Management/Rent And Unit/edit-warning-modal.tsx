"use client";

import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EditWarningModal = ({ id }: { id:string }) => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-darkText-primary px-4 py-5 lg:py-10 absolute bottom-0 left-0 right-0">
      <p className="text-center font-semibold my-4 text-brand-9">
        This action will navigate you away from the Rent and Unit menu to
        another menu. You can choose to proceed or exit from the process
      </p>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-between gap-10">
          <Button
            type="submit"
            className="py-2 px-8"
            size="16_bold"
            onClick={() => {
              router.push(`/management/properties/${id}/edit-property`);
            }}
          >
            Proceed
          </Button>
          <ModalTrigger asChild close>
            <Button type="submit" className="py-2 px-8" size="16_bold">
              Exit
            </Button>
          </ModalTrigger>
        </div>
      </div>
    </div>
  );
};

export default EditWarningModal;
