"use client";
import { useState, useEffect } from "react";
import Input from "@/components/Form/Input/input";
import { useRouter } from "next/navigation";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import {
  ChevronLeft,
  PlusIcon,
  DeleteIconX,
  DeleteIconOrange,
} from "@/public/icons/icons";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import Image from "next/image";
import { type StateType } from "./data";

const CreateProperty = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  const [state, setState] = useState<StateType>({
    selectedState: "",
    selectedLGA: "",
    selectedCity: "",
    localGovernments: [],
    cities: [],
    staff: [],
    images: [],
    branchOptions: [],
    inventoryOptions: [],
    landlordOptions: [],
    accountOfficerOptions: [],
    resetKey: 0,
  });
  const {
    selectedState,
    selectedLGA,
    selectedCity,
    localGovernments,
    cities,
    staff,
    images,
    branchOptions,
    inventoryOptions,
    landlordOptions,
    accountOfficerOptions,
    resetKey,
  } = state;

  const handleStateChange = (value: string) => {
    setState((x) => ({ ...x, selectedState: value }));
  };

  const handleLGAChange = (value: string) => {
    setState((x) => ({ ...x, selectedLGA: value }));
  };

  const handleCityChange = (selectedCity: string) => {
    setState((x) => ({ ...x, selectedCity }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newImages = selectedFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        // 2 MB in bytes
        alert(`${file.name} exceeds the 2MB size limit.`);
        return false;
      }
      return true;
    });

    const finalImages = [...images, ...newImages].slice(0, 2); // Limit to 2 images
    setState((x) => ({ ...x, images: finalImages }));

    // Reset input value to allow re-uploading the same file
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setState((x) => ({ ...x, images: updatedImages }));
  };

  const addStaff = () => {
    if (staff.length < 3) {
      setState((x) => ({
        ...x,
        staff: [
          ...x.staff,
          {
            id: `staff${x.staff.length + 1}`,
            label: `Staff ${x.staff.length + 1}`,
          },
        ],
      }));
    }
  };

  const removeStaff = (id: string) => {
    const updatedStaff = staff.filter((staffMember) => staffMember.id !== id);
    updatedStaff.forEach((staffMember, index) => {
      staffMember.id = `staff${index + 1}`;
      staffMember.label = `Staff ${index + 1}`;
    });
    setState((x) => ({ ...x, staff: updatedStaff }));
  };

  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setState((x) => ({
        ...x,
        localGovernments: lgas,
        selectedLGA: "",
        selectedCity: "",
        cities: [],
      }));
    } else {
      setState((x) => ({
        ...x,
        localGovernments: [],
        selectedLGA: "",
        selectedCity: "",
        cities: [],
      }));
    }
  }, [selectedState]);

  // Update cities when LGA changes
  useEffect(() => {
    if (selectedLGA && selectedState) {
      const cities = getCities(selectedState, selectedLGA);
      setState((x) => ({
        ...x,
        cities,
        selectedCity: "",
      }));
    } else {
      setState((x) => ({
        ...x,
        cities: [],
        selectedCity: "",
      }));
    }
  }, [selectedLGA, selectedState]);

  useEffect(() => {
    // fetch options for branch, inventory, landlord, account officer
    // update state values
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Post data to API
    const form = e.currentTarget;
    const formData = new FormData(form);

    // formData.append("image", images); append d images from d state

    router.push("/management/properties/create-rental-property/add-unit");
  };

  // Function to reset the state
  const handleReset = () => {
    setState((x) => ({
      ...x,
      resetKey: x.resetKey + 1,
      selectedState: "",
      images: [],
      staff: [],
    }));
  };

  return (
    <div className="pb-[80px]">
      {/* Back Button & Page Title */}
      <div className="flex items-center gap-1 mb-5 lg:mb-8">
        <button
          type="button"
          aria-label="Go Back"
          onClick={goBack}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black font-bold text-lg lg:text-xl">
          Create Rental Property
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-[970px]">
        <input name="property_tag" type="hidden" value="rental" readOnly />
        {/* Backend is Looking for it */}
        <div className="mb-5 lg:mb-8">
          <p className="mb-5">
            Set property pictures for easy recognition (maximum of 2 images).
          </p>
          <div className="flex gap-4 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-[285px] h-[155px] rounded-lg overflow-hidden border border-gray-300"
              >
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Property Image ${index + 1}`}
                  className="object-cover object-center w-full h-full"
                  fill
                />
                <button
                  type="button"
                  aria-label="Remove Image"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1"
                >
                  <DeleteIconOrange size={20} />
                </button>
              </div>
            ))}
            {images.length < 2 && (
              <label
                htmlFor="upload"
                className="w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
              >
                <PlusIcon />
                <span className="text-black text-base font-normal mt-2">
                  Add Pictures
                </span>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        <div className="md:grid md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Input
            id="video_link"
            label="Video Link"
            type="url"
            className="mb-5"
            placeholder="https://www.youtube.com/video "
            inputClassName="bg-white rounded-[8px] md:col-span-1"
          />
        </div>
        {/* Property Details */}
        <div className="flex gap-[2px] text-xs md:text-sm lg:text-base font-medium mb-4">
          <span className="text-status-error-primary">*</span>
          <p className="text-primary-navy font-bold text-lg lg:text-xl">
            Property Details
          </p>
        </div>
        <hr className="my-4" />
        <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Input
            id="property_title"
            label="Property Title"
            placeholder="Design name or Decsription"
            inputClassName="bg-white rounded-[8px]"
          />
          <Select
            id="state"
            options={getAllStates()}
            label="State"
            value={selectedState}
            onChange={handleStateChange}
            inputContainerClassName="bg-white"
          />
          <Select
            options={localGovernments}
            id="local_govt"
            label="local government"
            onChange={handleLGAChange}
            value={selectedLGA}
            inputContainerClassName="bg-white"
          />
          <Select
            options={cities}
            id="city"
            label="City / Area"
            allowCustom={true}
            onChange={handleCityChange}
            value={selectedCity}
            inputContainerClassName="bg-white"
          />
          <Input
            id="address"
            label="Full Address"
            inputClassName="bg-white rounded-[8px]"
          />
          <Select
            options={["residential", "mixed use", "commercial"]}
            id="category"
            label="Category"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={branchOptions}
            id="branch_id"
            label="Branch"
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={inventoryOptions}
            id="inventory_id"
            label="Inventory"
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={landlordOptions}
            id="landlord_id"
            label="Landlord"
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={accountOfficerOptions}
            id="account_officer_id"
            label="Account Officer"
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          {staff.map(({ id, label }) => (
            <div key={id} className="relative">
              <Select
                options={[]}
                id={id}
                label={label}
                inputContainerClassName="bg-white"
              />
              <button
                type="button"
                aria-label="Remove Staff"
                onClick={() => removeStaff(id)}
                className="absolute top-0 right-0 w-[18px] h-[18px]"
              >
                <DeleteIconX size={20} />
              </button>
            </div>
          ))}
          {staff.length < 3 && (
            <button
              type="button"
              onClick={addStaff}
              className="text-brand-9 text-xs md:text-sm font-normal md:self-end md:justify-self-start"
            >
              {`${staff.length > 0 ? "Add more staff" : "Add Staff"}`}
            </button>
          )}
          <TextArea
            id="property_description"
            label="Property Description"
            inputSpaceClassName="bg-white"
            className="md:col-span-2 lg:col-span-3"
            placeholder="Write here"
            resetKey={resetKey}
          />
        </div>
        {/* Property Settings */}
        <div className="flex gap-[2px] text-xs md:text-sm lg:text-base font-medium mb-4">
          <span className="text-status-error-primary">*</span>
          <p className="text-primary-navy font-bold text-lg lg:text-xl">
            Property Settings
          </p>
        </div>
        <hr className="my-4" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Select
            id="agency_fee"
            label="Agency Fee"
            options={[
              "1%",
              "2%",
              "2.5%",
              "3%",
              "3.5%",
              "5%",
              "6%",
              "7%",
              "7.5%",
              "8%",
              "9%",
              "10%",
            ]}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            id="who_to_charge"
            options={["landlord", "tenants", "both", "none"]}
            label="Who to Charge"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            id="fee_period"
            label="Fee Periods"
            options={[
              "daily",
              "weekly",
              "monthly",
              "quarterly",
              "bi-annually",
              "yearly",
            ]}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={[
              "keep with landlord",
              "keep with manager",
              "escrow it",
              "none",
            ]}
            isSearchable={false}
            id="caution_deposit"
            label="Caution Deposit"
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            id="group_chat"
            label="Group Chat"
            options={["yes", "no"]}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={["yes", "no"]}
            id="fee_penalty"
            label="Rent Penalty"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={["yes", "no"]}
            id="request_callback"
            label="Request Call Back"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={["yes", "no"]}
            id="book_visitors"
            label="Book Visitors"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={["yes", "no"]}
            id="vehicle_records"
            label="Vehicle Records"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={["yes", "no"]}
            id="activate_vat"
            label="Activate 7.5% VAT"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Select
            options={["(₦) NAIRA", "($) USD", "(£) POUNDS"]}
            id="currency"
            label="Currency"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
          />
          <Input
            id="coordinate"
            label="Cordinates"
            inputClassName="bg-white rounded-[8px]"
          />
        </div>
        <div className="fixed w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
          <button
            type="reset"
            className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
            onClick={handleReset}
          >
            Clear Fields
          </button>
          <button
            type="submit"
            className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
            onClick={() => {}}
          >
            Add Unit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
