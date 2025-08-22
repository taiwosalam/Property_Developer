import { useState } from "react";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { addPropertyWithId } from "./data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useModal } from "@/components/Modal/modal";
import { toast } from "sonner";

const AddPropertyWithId = () => {
  const { setIsOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { company_id } = usePersonalInfoStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company_id) return;
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const property_id = formData.get("property_id") as string;
    const status = await addPropertyWithId(property_id, company_id);
    // console.log(status);
    setIsLoading(false);
    if (status) {
      toast.success("Property Invitation Successful");
      setIsOpen(false);
    }
  };
  return (
    <form className="add-property-with-id flex justify-center" onSubmit={handleSubmit}>
      <div className="custom-flex-col gap-5 w-[300px]">
        <Input
          id="property_id"
          label="Input property ID"
          inputClassName="rounded-[8px]"
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            size="base_medium"
            className="py-2 px-8"
            disabled={isLoading}
          >
            {isLoading ? "Inviting..." : "Invite"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddPropertyWithId;
