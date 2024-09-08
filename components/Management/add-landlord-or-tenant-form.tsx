import { useState, useEffect } from "react";
import Image from "next/image";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";

interface AddLandLordOrTenantFormProps {
  type: "landlord" | "tenant";
  submitAction: () => void;
}

const AddLandLordOrTenantForm: React.FC<AddLandLordOrTenantFormProps> = ({
  type,
  submitAction,
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  const handleLGAChange = (value: string) => {
    setSelectedLGA(value);
  };
  // Update local governments when state changes
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas);
    } else {
      setLocalGovernments([]);
    }
    setSelectedLGA("");
  }, [selectedState]);

  return (
    <form className="custom-flex-col gap-5" onSubmit={submitAction}>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="first-name"
          label="first name"
          required
          inputClassName="rounded-[8px]"
        />
        <Input
          id="last-name"
          label="last name"
          required
          inputClassName="rounded-[8px]"
        />
        <Input
          id="email"
          label="email"
          type="email"
          required
          inputClassName="rounded-[8px]"
        />
        <Input
          id="phone-number"
          label="phone number"
          inputClassName="rounded-[8px]"
        />
        <Select
          options={getAllStates()}
          id="state"
          name="state"
          label="state"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
          value={selectedState ? selectedState : undefined}
          onChange={handleStateChange} // Update handler
        />
        <Select
          options={localGovernments}
          id="local_government"
          name="local_government"
          label="local government"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
          onChange={handleLGAChange} // Update handler
          value={selectedLGA ? selectedLGA : undefined} // Controlled value
        />
        <Input id="address" label="address" inputClassName="rounded-[8px]" />
        <Select
          options={["Individual", "Couples", "Widow"]}
          id={`${type === "landlord" ? "owner" : "tenant"}_type`}
          name={`${type === "landlord" ? "owner" : "tenant"}_type`}
          label={`${type === "landlord" ? "owner" : "Tenant/Occupant"} Type`}
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
        <Select
          options={["male", "female"]}
          id="gender"
          name="gender"
          label="Gender"
          isSearchable={false}
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2 rounded-[8px]"
        />
      </div>
      <div className="flex justify-between">
        <div className="custom-flex-col gap-3">
          <p className="text-black text-base font-medium">
            Upload picture or select an avatar.
          </p>
          <div className="flex items-end gap-3">
            <div className="w-[70px] h-[70px]">
              <Image
                src={CameraCircle}
                alt="camera"
                width={70}
                height={70}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {Array(4)
                .fill(null)
                .map((_, idx) => (
                  <button key={idx}>
                    <Image
                      src={`/empty/avatar-${idx + 1}.svg`}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button type="submit" size="base_medium" className="py-2 px-8">
            create
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddLandLordOrTenantForm;
