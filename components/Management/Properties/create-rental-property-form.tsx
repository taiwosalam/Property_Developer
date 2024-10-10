"use client";

import { useState, useEffect, Fragment } from "react";

// Types
import type { CreatePropertyFormProps } from "./types";
import type { PropertyStateDataKeys } from "@/app/(nav)/management/properties/create-rental-property/types";
import {
  proerty_state_data,
  type StateType,
} from "@/app/(nav)/management/properties/create-rental-property/data";

// Images
import { PlusIcon, DeleteIconX } from "@/public/icons/icons";

// Imports
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeletePropertyModal from "@/components/Management/Properties/delete-property-modal";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "./sortable-image";
import { propertyCategories, rentPeriods } from "@/data";
import { AuthForm } from "@/components/Auth/auth-components";
import { getAllBranches } from "@/app/(nav)/management/staff-branch/data";
import { useAuthStore } from "@/store/authstrore";
import { getAllLandlords } from "@/app/(nav)/management/landlord/data";
import { getAllStaffsByBranch } from "./data";
import { currencySymbols } from "@/utils/number-formatter";

const MAX_FILE_SIZE_MB = 2; // Maximum file size in MB

const CreateRentalPropertyForm: React.FC<CreatePropertyFormProps> = ({
  editMode,
  handleSubmit,
}) => {
  const [state, setState] = useState<StateType>(proerty_state_data);

  const accessToken = useAuthStore((state) => state.access_token);

  const {
    selectedState,
    selectedLGA,
    selectedCity,
    selectedBranch,
    localGovernments,
    cities,
    staff,
    staffOptions,
    images,
    branchOptions,
    inventoryOptions,
    landlordOptions,
    accountOfficerOptions,
    resetKey,
  } = state;

  const sortableImages = images.map((image, index) => ({
    id: index,
    index,
    image,
  }));

  const setPropertyState = (
    changes: Partial<Record<PropertyStateDataKeys, any>>
  ) => {
    setState((x) => ({ ...x, ...changes }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 6 - images.length);
    const validImages: string[] = [];
    const oversizeImages: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Upload only image files.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        oversizeImages.push(file.name);
        continue;
      }
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          validImages.push(reader.result as string);
          if (validImages.length + oversizeImages.length === files.length) {
            setState((x) => ({
              ...x,
              images: [...x.images, ...validImages].slice(0, 6),
            }));
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("There was an error processing your image. Please try again.");
      }
    }

    if (oversizeImages.length > 0) {
      alert(
        `Some files were not uploaded due to exceeding the maximum size: ${MAX_FILE_SIZE_MB} MB`
      );
    }
    e.target.value = ""; // Reset input value to allow re-uploading the same file
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    if (activeId !== overId) {
      const oldIndex = sortableImages.findIndex(
        (image) => image.id === active.id
      );
      const newIndex = sortableImages.findIndex(
        (image) => image.id === over.id
      );
      const newImages = arrayMove(images, oldIndex, newIndex);
      setState((x) => ({ ...x, images: newImages }));
    }
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
            id: `staff${x.staff.length + 1}_id`,
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

  // Get primary data from the backend
  useEffect(() => {
    const fetchData = async () => {
      const [branches, landlords] = await Promise.all([
        getAllBranches(accessToken),
        getAllLandlords(accessToken),
      ]);

      setPropertyState({
        branchOptions: branches.branches.map((branch) => ({
          value: branch.id,
          label: branch.branch_title,
        })),
        landlordOptions: landlords.landlords.map((landlord) => ({
          value: landlord.id,
          label: `${landlord.first_name} ${landlord.last_name}`,
        })),
      });
    };

    fetchData();
  }, [accessToken]);

  // Gets staffs by branch
  useEffect(() => {
    const fetchStaff = async () => {
      const staff = await getAllStaffsByBranch(selectedBranch, accessToken);

      setPropertyState({
        staffOptions: staff.map((staff) => ({
          value: staff.id,
          label: staff.full_name,
        })),
      });
    };

    if (selectedBranch) fetchStaff();
  }, [accessToken, selectedBranch]);

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
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleSubmit}
      setValidationErrors={() => {}}
      className="max-w-[970px] pb-[80px]"
    >
      <input name="property_tag" type="hidden" value="rental" readOnly />
      {/* Backend is Looking for it */}
      <div className="mb-5 lg:mb-8">
        <p className="mb-5 text-text-secondary text-base font-normal">
          Set property pictures for easy recognition (maximum of 6 images).
        </p>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortableImages.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden">
              {sortableImages.map((s) => (
                <SortableImage
                  key={s.id}
                  id={s.id}
                  image={s.image}
                  index={s.index}
                  removeImage={removeImage}
                />
              ))}
              {images.length < 6 && (
                <label
                  htmlFor="upload"
                  className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
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
          </SortableContext>
        </DndContext>
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
          inputContainerClassName="bg-white"
          onChange={(selectedState) => setPropertyState({ selectedState })}
        />
        <Select
          options={localGovernments}
          id="local_govt"
          label="local government"
          value={selectedLGA}
          inputContainerClassName="bg-white"
          onChange={(selectedLGA) => setPropertyState({ selectedLGA })}
        />
        <Select
          options={cities}
          id="city"
          label="City / Area"
          allowCustom={true}
          value={selectedCity}
          inputContainerClassName="bg-white"
          onChange={(selectedCity) => setPropertyState({ selectedCity })}
        />
        <Input
          id="full_address"
          label="Full Address"
          inputClassName="bg-white rounded-[8px]"
        />
        <Select
          options={propertyCategories["rental property"]}
          id="category"
          label="Category"
          isSearchable={false}
          inputContainerClassName="bg-white"
          resetKey={resetKey}
        />
        <Select
          id="branch_id"
          label="Branch"
          resetKey={resetKey}
          options={branchOptions}
          inputContainerClassName="bg-white"
          onChange={(selectedBranch) => setPropertyState({ selectedBranch })}
        />
        <Select
          options={inventoryOptions}
          id="inventory_id"
          label="Inventory"
          value="1" // NOTE: Remove this later
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
          value="10" // NOTE: Remove this later
          inputContainerClassName="bg-white"
          resetKey={resetKey}
        />
        {staff.map(({ id, label }) => (
          <div key={id} className="relative">
            <Select
              options={staffOptions}
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
            { value: 1, label: "1%" },
            { value: 2, label: "2%" },
            { value: 2.5, label: "2.5%" },
            { value: 3, label: "3%" },
            { value: 3.5, label: "3.5%" },
            { value: 5, label: "5%" },
            { value: 6, label: "6%" },
            { value: 7, label: "7%" },
            { value: 7.5, label: "7.5%" },
            { value: 8, label: "8%" },
            { value: 9, label: "9%" },
            { value: 10, label: "10%" },
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
          options={rentPeriods}
          isSearchable={false}
          inputContainerClassName="bg-white"
          resetKey={resetKey}
        />
        <Select
          options={[
            { value: "landlord", label: "Keep with Landlord" },
            { value: "manager", label: "Keep with Manager" },
            { value: "escrow", label: "Escrow it" },
            { value: "none", label: "None" },
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
          options={Object.entries(currencySymbols).map(([key, symbol]) => ({
            value: key,
            label: `${symbol} ${key.charAt(0) + key.slice(1).toLowerCase()}`,
          }))}
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
      <div
        className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent"
        style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
      >
        {editMode ? (
          <Fragment>
            <Modal>
              <ModalTrigger asChild>
                <Button
                  size="sm_medium"
                  variant="light_red"
                  className="py-2 px-7"
                >
                  delete property
                </Button>
              </ModalTrigger>
              <ModalContent>
                <DeletePropertyModal />
              </ModalContent>
            </Modal>
            <Button
              type="button"
              size="sm_medium"
              variant="sky_blue"
              className="py-2 px-7"
            >
              Add more unit
            </Button>
            <Button type="button" size="sm_medium" className="py-2 px-7">
              update
            </Button>
          </Fragment>
        ) : (
          <Fragment>
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
          </Fragment>
        )}
      </div>
    </AuthForm>
  );
};

export default CreateRentalPropertyForm;
