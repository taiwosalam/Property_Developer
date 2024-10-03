import Image from "next/image";
import { useState } from "react";
import { AuthForm } from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useImageUploader } from "@/hooks/useImageUploader";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Button from "@/components/Form/Button/button";
import { ValidationErrors } from "@/utils/types";

const AddServiceProviderForm = ({
  submitAction,
}: {
  submitAction: (data: any) => void;
}) => {
  const { preview, handleImageChange } = useImageUploader({
    placeholder: CameraCircle,
  });
  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    localGovernments: [] as string[],
    errorMsgs: {} as ValidationErrors,
    avatarArray: [] as string[],
  });
  const {
    selectedState,
    selectedLGA,
    localGovernments,
    avatarArray,
    errorMsgs,
  } = state;

  const handleStateChange = (value: string) => {
    setState((prev) => ({ ...prev, selectedState: value }));
  };

  const handleLGAChange = (value: string) => {
    setState((prev) => ({ ...prev, selectedLGA: value }));
  };
  return (
    <AuthForm
      className="custom-flex-col gap-5"
      onFormSubmit={submitAction}
      setValidationErrors={(errors: ValidationErrors) =>
        setState((prev) => ({ ...prev, errorMsgs: errors }))
      }
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="full_name"
          label="full name"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          required
          id="company_name"
          label="company name"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          required
          id="email"
          label="email"
          type="email"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          id="services_rendered"
          label="Services Rendered"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          id="company_phone"
          label="Company Phone"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          id="personal_phone"
          label="Personal Phone"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Input
          id="company_address"
          label="Company Address"
          inputClassName="rounded-[8px]"
          //   validationErrors={errorMsgs}
        />
        <Select
          //   validationErrors={errorMsgs}
          options={getAllStates()}
          id="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={handleStateChange}
        />
        <Select
          //   validationErrors={errorMsgs}
          options={localGovernments}
          id="local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          onChange={handleLGAChange}
          value={selectedLGA}
        />
      </div>
      <div className="flex justify-between items-end">
        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">
            Upload picture or select an avatar.
          </p>
          <div className="flex items-end gap-3">
            <label
              htmlFor="picture"
              className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] cursor-pointer"
            >
              <Image
                src={preview}
                alt="camera"
                fill
                sizes="70px"
                className="rounded-full object-cover"
              />
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                className="hidden pointer-events-none"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex gap-2">
              {avatarArray.map((value, idx) => (
                <button type="button" key={idx}>
                  <Image
                    src={value}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button type="submit" size="base_medium" className="py-2 px-8">
          create
        </Button>
      </div>
    </AuthForm>
  );
};

export default AddServiceProviderForm;
