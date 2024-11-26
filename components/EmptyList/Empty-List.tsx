import Button from "../Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";

const EmptyList: React.FC<{
  title: string;
  body?: React.ReactNode;
  buttonText: string;
  buttonLink?: string;
  modalContent?: React.ReactNode;
}> = ({ title, body, buttonText, buttonLink, modalContent }) => {
  return (
    <div className="mt-[140px] space-y-10">
      {modalContent ? (
        <Modal>
          <ModalTrigger asChild>
            <Button className="rounded-[8px] py-2 px-6 lg:px-12 text-base font-semiboldbold w-fit mx-auto block">
              {buttonText}
            </Button>
          </ModalTrigger>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      ) : (
        <Button
          href={buttonLink}
          className="rounded-[8px] py-2 px-6 lg:px-12 text-base font-semiboldbold w-fit mx-auto block"
        >
          {buttonText}
        </Button>
      )}
      <div className="space-y-4 w-[85%] mx-auto">
        <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
          {title}
        </p>
        <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
        <div className="text-text-secondary dark:text-darkText-2 font-normal text-sm">
          {body}
        </div>
      </div>
    </div>  
  );
};

export default EmptyList;
