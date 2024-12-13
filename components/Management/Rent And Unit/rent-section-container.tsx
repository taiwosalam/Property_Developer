import { cn } from "@/lib/utils";
import clsx from "clsx";
import { FeeDetail } from "./types";
import { DetailItem } from "../detail-item";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import EditWarningModal from "./edit-warning-modal";
import Button from "@/components/Form/Button/button";

export const RentSectionContainer: React.FC<{
  title: string;
  children: React.ReactNode;
  hidebar?: boolean;
  className?: string;
}> = ({ title, children, hidebar, className }) => (
  <div
    className={cn(
      "bg-white p-4 rounded-lg dark:bg-darkText-primary",
      className
    )}
    style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
  >
    <h3
      className={clsx("font-medium text-brand-10 text-base", {
        "mb-4": hidebar,
      })}
    >
      {title}
    </h3>
    <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 my-4" hidden={hidebar} />
    {children}
  </div>
);

export const RentSectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="font-bold text-primary-navy dark:text-white text-lg lg:text-xl">
    {children}
  </h2>
);

export const FeeDetails: React.FC<{
  title: string;
  feeDetails: FeeDetail[];
  total_package: number;
  id: string;
}> = ({ title, feeDetails, total_package, id }) => {
  const totalFee = feeDetails
    .reduce((acc, fee) => acc + fee.amount, 0)
    .toLocaleString();
  return (
    <RentSectionContainer title={title}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-y-4 gap-x-2">
          {feeDetails.map((fee, index) => (
            <DetailItem
              key={index}
              style={{ width: "120px" }}
              label={fee.name}
              value={`₦${fee.amount.toLocaleString()}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-[#747474] dark:text-white text-base font-normal">
              Total Package
            </p>
            <p className="text-lg lg:text-xl text-brand-9 font-bold">
            {`₦${total_package.toLocaleString()}`}
            </p>
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button type="submit" className="py-2 px-6" size="base_medium">
                Edit
              </Button>
            </ModalTrigger>
            <ModalContent>
              <EditWarningModal id={id}/>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </RentSectionContainer>
  );
};
