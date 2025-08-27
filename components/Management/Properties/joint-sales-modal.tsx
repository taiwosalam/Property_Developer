import { useState } from "react";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { addPropertyWithId } from "./data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useModal } from "@/components/Modal/modal";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";

const ActivateJointSales = () => {
  const { setIsOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};
  return (
    <AuthForm
      className="add-property-with-id flex justify-center"
      onFormSubmit={handleSubmit}
    >
      <div className="custom-flex-col gap-5 w-[300px]">
        <Input
          id="company_id"
          label="Input Company/User ID"
          inputClassName="rounded-[8px]"
        />
        <Input
          id="property_id"
          label="Input property ID"
          inputClassName="rounded-[8px]"
        />
        <div className="flex justify-center">
          <Button type="submit" size="base_medium" className="py-2 px-8">
            {isLoading ? "Inviting..." : "Add"}
          </Button>
        </div>
      </div>
    </AuthForm>
  );
};

export default ActivateJointSales;
