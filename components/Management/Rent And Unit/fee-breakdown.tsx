"use client";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { FeeDetail } from "./types";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";

export const FeeBreakdown: React.FC<{
  feeDetails: FeeDetail[];
  onEdit: () => void;
  title1?: string;
  title2?: string;
}> = ({ feeDetails, onEdit, title1, title2 }) => {
  const totalFee = feeDetails
    .reduce((acc, fee) => acc + fee.amount, 0)
    .toLocaleString();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <h6 className="my-4 font-bold text-[#092C4C] dark:text-white text-xl">
        {title1 || "Estate Fee"}
      </h6>
      <div className="py-4 px-6 bg-white dark:bg-darkText-primary shadow-lg rounded-md space-y-2">
        <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
          {title2 || "Occupant Fee"}
        </h6>
        <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
        <div className="grid grid-cols-2 text-text-label">
          {feeDetails.map((fee, index) => (
            <div
              key={index}
              className="w-2/3 flex items-center justify-between space-y-2"
            >
              <span className="dark:text-white">{fee.name}</span>
              <span className="text-black dark:text-darkText-2">
                ₦{fee.amount.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="mt-4 font-bold">
            <p className="dark:text-white">Total Package</p>
            <p className="text-xl text-brand-9">₦{totalFee}</p>
          </div>

          <div className="mt-4 text-right">
            <Modal>
              <ModalTrigger asChild>
                <Button type="submit" className="py-2 px-8" onClick={() => {}}>
                  Edit
                </Button>
              </ModalTrigger>
              <ModalContent>
                <div className="bg-white py-10 absolute bottom-0 left-0 right-0">
                  <p className="text-center font-semibold my-4 text-brand-9">
                    This action will navigate you away from the Rent and Unit
                    menu to another menu. You can choose to continue or exit
                    from the process
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
    </div>
  );
};
