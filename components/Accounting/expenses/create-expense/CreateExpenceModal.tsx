import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX } from "@/public/icons/icons";

const CreateExpenceModal = () => {
  return (
    <div className="w-[700px] max-w-[80%] max-h-[500px] h-[70vh] rounded-[20px] bg-white dark:bg-darkText-primary overflow-y-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white dark:bg-darkText-primary">
        <div className="flex items-center gap-2">
          <p className="text-primary-navy dark:text-darkText-1 text-base md:text-lg lg:text-xl font-bold capitalize">
            Add Property
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button" aria-label="close">
          <DeleteIconX color="black" size={34} />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="flex items-center justify-center my-auto">
        <div className="mt-28 space-y-5 w-full max-w-[300px]">
          <Select
            id="dshef"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
            ]}
          ></Select>
          <div className="w-full flex items-center justify-center">
            <Button
              onClick={() =>
                (window.location.href = "/accounting/expenses/create-expenses")
              }
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExpenceModal;
