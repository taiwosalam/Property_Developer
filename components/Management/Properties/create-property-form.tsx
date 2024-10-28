"use client";

import { useState, useEffect } from "react";

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
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "./draggable-image";
import { propertyCategories, rentPeriods } from "@/data";
import { AuthForm } from "@/components/Auth/auth-components";
import { getAllBranches } from "@/app/(nav)/management/staff-branch/data";
import { useAuthStore } from "@/store/authstrore";
import { getAllLandlords } from "@/app/(nav)/management/landlord/data";
import { getAllStaffsByBranch } from "./data";
import { currencySymbols } from "@/utils/number-formatter";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import PropertyFormFooter from "./property-form-footer.tsx";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { MAX_FILE_SIZE_MB } from "@/data";

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  editMode,
  handleSubmit,
  formType,
}) => {
  const [state, setState] = useState<StateType>(proerty_state_data);

  const isDarkMode = useDarkMode();
  const accessToken = useAuthStore((state) => state.access_token);

  const {
    state: selectedState,
    lga,
    city,
    selectedBranch,
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
    id: uuidv4(),
    index,
    image,
  }));

  const setPropertyState = (
    changes: Partial<Record<PropertyStateDataKeys, any>>
  ) => {
    setState((x) => {
      const newState = { ...x, ...changes };
      if ("state" in changes) {
        newState.lga = "";
        newState.city = "";
      } else if ("lga" in changes) {
        newState.city = "";
      }
      return newState;
    });
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const newImages = Array.from(images);
    const [movedImage] = newImages.splice(source.index, 1);
    newImages.splice(destination.index, 0, movedImage);

    setState((x) => ({ ...x, images: newImages }));
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

  // Function to reset the state
  const handleReset = () => {
    setState((x) => ({
      ...x,
      resetKey: x.resetKey + 1,
      state: "",
      images: [],
      staff: [],
    }));
  };

  return (
    <FlowProgress
      steps={1}
      activeStep={0}
      inputClassName="property-form-input"
      images={state.images}
      imagesRequired={true}
      showProgressBar={false}
    >
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleSubmit}
        setValidationErrors={() => {}}
        className="max-w-[970px] pb-[80px]"
      >
        {/* Backend is Looking for it */}
        <input
          name="property_tag"
          type="hidden"
          value={formType}
          readOnly
          required
        />
        <div className="mb-5 lg:mb-8">
          <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
            Set {formType === "rental" ? "property" : "Estate/Facility"}{" "}
            pictures for easy recognition (maximum of 6 images). Please drag
            your preferred image and place it in the first position to make it
            the primary display.
          </p>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="property-images" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-4 overflow-x-auto custom-round-scrollbar overflow-y-hidden"
                >
                  {sortableImages.map((s) => (
                    <DraggableImage
                      key={s.id}
                      id={s.id}
                      image={s.image}
                      index={s.index}
                      removeImage={removeImage}
                    />
                  ))}
                  {provided.placeholder}
                  {images.length < 6 && (
                    <label
                      htmlFor="property_pictures"
                      className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
                    >
                      <PlusIcon />
                      <span className="text-black text-base font-normal mt-2">
                        Add Pictures
                      </span>
                      <input
                        id="property_pictures"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          {formType === "rental"
            ? "Property Details"
            : "Estate/Facility Details"}
        </p>
        <hr className="my-4" />
        <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
          <Input
            id="property_title"
            label={formType === "rental" ? "Property Title" : "Estate Name"}
            placeholder="Design name or Decsription"
            inputClassName="bg-white dark:bg-darkText-primary rounded-[8px] property-form-input"
            requiredNoStar
          />
          <Select
            id="state"
            options={getAllStates()}
            label="State"
            value={selectedState}
            inputContainerClassName="bg-white"
            onChange={(state) => setPropertyState({ state })}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={getLocalGovernments(selectedState)}
            id="local_govt"
            label="local government"
            value={lga}
            inputContainerClassName="bg-white"
            onChange={(lga) => setPropertyState({ lga })}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={getCities(selectedState, lga)}
            id="city"
            label="City / Area"
            allowCustom={true}
            value={city}
            onChange={(city) => setPropertyState({ city })}
            inputContainerClassName="bg-white"
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Input
            id="full_address"
            label="Full Address"
            inputClassName="bg-white rounded-[8px] property-form-input"
            requiredNoStar
          />
          <Select
            options={
              formType === "rental"
                ? propertyCategories["rental property"]
                : propertyCategories["gated estate/facility"]
            }
            id="category"
            label="Category"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            id="branch_id"
            label="Branch"
            resetKey={resetKey}
            options={branchOptions}
            inputContainerClassName="bg-white"
            onChange={(selectedBranch) => setPropertyState({ selectedBranch })}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          {formType === "rental" && (
            <>
              <Select
                options={inventoryOptions}
                id="inventory_id"
                label="Inventory"
                value="1" // NOTE: Remove this later
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                requiredNoStar
                hiddenInputClassName="property-form-input"
              />
              <Select
                options={landlordOptions}
                id="landlord_id"
                label="Landlord"
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                requiredNoStar
                hiddenInputClassName="property-form-input"
              />
            </>
          )}
          <Select
            options={accountOfficerOptions}
            id="account_officer_id"
            label="Account Officer"
            value="10" // NOTE: Remove this later
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
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
            label={
              formType === "rental"
                ? "Property Description"
                : "Estate/Facility Description"
            }
            className="md:col-span-2 lg:col-span-3 dark:text-white !dark:bg-transparent"
            placeholder="Write here"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
            inputSpaceClassName={`${
              isDarkMode ? "bg-transparent" : "bg-white"
            }`}
          />
        </div>
        {/* Property Settings */}

        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          {formType === "rental"
            ? "Property Settings"
            : "Estate/Facility Settings"}
        </p>

        <hr className="my-4" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
          <Select
            id={formType === "rental" ? "agency_fee" : "management_fee"}
            label={formType === "rental" ? "Agency Fee" : "Management Fee"}
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
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          {formType === "rental" && (
            <Select
              id="who_to_charge"
              options={["landlord", "tenants", "both", "none"]}
              label="Who to Charge"
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              hiddenInputClassName="property-form-input"
            />
          )}
          <Select
            id="fee_period"
            label="Fee Periods"
            options={rentPeriods}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          {formType === "rental" && (
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
              requiredNoStar
              hiddenInputClassName="property-form-input"
            />
          )}
          <Select
            id="group_chat"
            label="Group Chat"
            options={["yes", "no"]}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="fee_penalty"
            label={formType === "rental" ? "Rent Penalty" : "Fee Penalty"}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="request_callback"
            label="Request Call Back"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="book_visitors"
            label="Book Visitors"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="vehicle_records"
            label="Vehicle Records"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="activate_vat"
            label="Activate 7.5% VAT"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          {formType === "rental" && (
            <>
              <Select
                options={Object.entries(currencySymbols).map(
                  ([key, symbol]) => ({
                    value: key,
                    label: `${symbol} ${
                      key.charAt(0) + key.slice(1).toLowerCase()
                    }`,
                  })
                )}
                id="currency"
                label="Currency"
                isSearchable={false}
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                requiredNoStar
                hiddenInputClassName="property-form-input"
              />
              <Input
                id="coordinate"
                label="Cordinates"
                inputClassName="bg-white rounded-[8px]"
              />
            </>
          )}
        </div>
        <PropertyFormFooter editMode={editMode} handleReset={handleReset} />
      </AuthForm>
    </FlowProgress>
  );
};

export default CreatePropertyForm;
