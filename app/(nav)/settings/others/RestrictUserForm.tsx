"use client";
import { useState } from "react";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { tenantTypes, genderTypes, titles } from "@/data";
import Input from "@/components/Form/Input/input";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import type { ValidationErrors } from "@/utils/types";
import { useAuthStore } from "@/store/authstrore";
import Picture from "@/components/Picture/picture";
import Avatars from "@/components/Avatars/avatars";
import TextArea from "@/components/Form/TextArea/textarea";
import { DirectorCard } from "@/components/Settings/settings-components";

interface RestrictUserFormProps {
  submitAction: (data: any) => void;
}

type Address = "selectedState" | "selectedLGA" | "selectedCity";

const RestrictUserForm: React.FC<RestrictUserFormProps> = ({ submitAction }) => {
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const { selectedState, selectedLGA, activeAvatar, errorMsgs } = state;

  const accessToken = useAuthStore((state) => state.access_token);

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={submitAction}
      className="custom-flex-col gap-5"
      setValidationErrors={(errors: ValidationErrors) =>
        setState((prevState) => ({ ...prevState, errorMsgs: errors }))
      }
    >
        <div className="flex w-full items-center justify-center">
        <DirectorCard
              name="Esv Abimbola Adedeji"
              email="abimbola@gmail.com"
              img="/empty/SampleLandlord.jpeg"
              phone="+2348132086958"
              icon="/icons/verified-success.svg"
            />
        </div>
        <div className="flex items-center justify-center gap-8 w-full">
        <Select
          validationErrors={errorMsgs}
          options={titles}
          id="property"
          label="Select Property"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
        />
        <Select
          validationErrors={errorMsgs}
          options={titles}
          id="tenants_name"
          label="Tenants Name"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
        />
            </div>
        <div className="flex w-full items-end justify-end">
        <Button type="submit" size="base_bold" variant="light_red" className="py-2 px-8 ml-auto">
          Restrict User
        </Button>
        </div>
    </AuthForm>
  );
};

export default RestrictUserForm;
