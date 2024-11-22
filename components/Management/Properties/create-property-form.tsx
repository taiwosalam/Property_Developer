"use client";

// Types
import type { CreatePropertyFormProps, PropertyFormStateType } from "./types";
import { convertYesNoToBoolean } from "@/utils/checkFormDataForImageOrAvatar";
import { useState, useEffect } from "react";
import { PlusIcon, DeleteIconX } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "./draggable-image";
import { propertyCategories, MAX_FILE_SIZE_MB } from "@/data";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  getAllBranches,
  getAllLandlords,
  getAllInventory,
  getAllStaffByBranch,
  property_form_state_data,
  transformPropertyFormData,
} from "./data";
import { currencySymbols } from "@/utils/number-formatter";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import PropertyFormFooter from "./property-form-footer.tsx";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const maxNumberOfImages = 6;

type SetPropertyStateChanges = Partial<{
  [K in keyof PropertyFormStateType]: PropertyFormStateType[K];
}>;

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  editMode,
  handleSubmit,
  formType,
}) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const [state, setState] = useState<PropertyFormStateType>(
    property_form_state_data
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    state: selectedState,
    lga,
    city,
    selectedBranch,
    staff,
    staffOptions,
    branchOptions,
    inventoryOptions,
    landlordOptions,
    accountOfficerOptions,
    resetKey,
  } = state;

  const setPropertyState = (changes: SetPropertyStateChanges) => {
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

  const {
    images,
    imageFiles,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleImageReorder,
    resetImages,
  } = useMultipleImageUpload({
    maxImages: maxNumberOfImages,
    maxFileSizeMB: MAX_FILE_SIZE_MB,
  });

  const sortableImages = images.map((image, index) => ({
    id: uuidv4(),
    index,
    image,
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;
    handleImageReorder(source.index, destination.index);
  };

  const addStaff = () => {
    if (staff.length < 3) {
      setPropertyState({
        staff: [
          ...staff,
          {
            id: `staff${staff.length + 1}_id`,
            label: `Staff ${staff.length + 1}`,
          },
        ],
      });
    }
  };

  const removeStaff = (id: string) => {
    const updatedStaff = staff.filter((staffMember) => staffMember.id !== id);
    updatedStaff.forEach((staffMember, index) => {
      staffMember.id = `staff${index + 1}`;
      staffMember.label = `Staff ${index + 1}`;
    });
    setPropertyState({ staff: updatedStaff });
  };

  // Function to reset the state
  const handleReset = () => {
    setState((x) => ({
      ...x,
      resetKey: x.resetKey + 1,
      state: "",
      lga: "",
      city: "",
      images: [],
      staff: [],
    }));
    resetImages();
    setSelectedCategory(null);
  };

  // Get primary data from the backend
  useEffect(() => {
    const fetchData = async () => {
      const [branches, landlords, inventory] = await Promise.all([
        getAllBranches(),
        getAllLandlords(),
        getAllInventory(),
      ]);

      setPropertyState({
        branchOptions: branches.map((branch) => ({
          value: branch.id,
          label: branch.branch_name,
        })),
        landlordOptions: landlords.map((landlord) => ({
          value: landlord.id,
          label: landlord.full_name,
        })),
        inventoryOptions: inventory.map((inventory) => ({
          value: inventory.id,
          label: inventory.inventory_name,
        })),
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;
    const fetchStaff = async () => {
      const staffMembers = await getAllStaffByBranch(selectedBranch);
      setPropertyState({
        staffOptions: staffMembers
          .filter((staff) => staff.position.toLowerCase() !== "account officer")
          .map((staff) => ({
            value: staff.id,
            label: staff.full_name,
          })),
        accountOfficerOptions: staffMembers
          .filter((staff) => staff.position.toLowerCase() === "account officer")
          .map((staff) => ({
            value: staff.id,
            label: staff.full_name,
          })),
      });
    };
    fetchStaff();
  }, [selectedBranch]);

  const yesNoFields = [
    "group_chat",
    "rent_penalty",
    "request_call_back",
    "book_visitors",
    "vehicle_record",
    "active_vat",
  ];

  const handleFormSubmit = async (data: Record<string, any>) => {
    setRequestLoading(true);
    convertYesNoToBoolean(data, yesNoFields);
    const payload = transformPropertyFormData(data, imageFiles, companyId);
    await handleSubmit(payload);
    setRequestLoading(false);
  };

  return (
    <FlowProgress
      steps={1}
      activeStep={0}
      inputClassName="property-form-input"
      images={images}
      imagesRequired={true}
      showProgressBar={false}
    >
      <AuthForm
        // returnType="form-data"
        onFormSubmit={handleFormSubmit}
        className="max-w-[970px] pb-[100px]"
      >
        <input
          name="property_type"
          type="hidden"
          value={formType === "rental" ? "rental" : "gated_estate"}
        />
        <div className="mb-5 lg:mb-8">
          <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
            Set {formType === "rental" ? "property" : "Estate/Facility"}{" "}
            pictures for easy recognition (maximum of {maxNumberOfImages}{" "}
            images). Please drag your preferred image and place it in the first
            position to make it the primary display.
          </p>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="property-images" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-4 overflow-x-auto custom-round-scrollbar overflow-y-hidden pb-2"
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
                      className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262] dark:text-darkText-2"
                    >
                      <PlusIcon />
                      <span className="text-black dark:text-white text-base font-normal mt-2">
                        Add Pictures
                      </span>
                      <input
                        id="property_pictures"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </label>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {formType === "rental" && (
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
        )}
        {/* Property Details */}
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          {formType === "rental"
            ? "Property Details"
            : selectedCategory?.toLocaleLowerCase() === "estate"
            ? "Estate Details"
            : selectedCategory?.toLocaleLowerCase() === "facility"
            ? "Facility Details"
            : "Estate/Facility Details"}
        </p>
        <hr className="my-4" />
        <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
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
            required
            hiddenInputClassName="property-form-input"
            onChange={(category) => setSelectedCategory(category)}
          />
          <Input
            id="title"
            label={
              formType === "rental"
                ? "Property Title"
                : selectedCategory?.toLocaleLowerCase() === "estate"
                ? "Estate Name"
                : "Facility Name"
            }
            placeholder="name"
            inputClassName="bg-white dark:bg-darkText-primary rounded-[8px] property-form-input"
            required
          />
          <Select
            id="state"
            options={getAllStates()}
            label="State"
            value={selectedState}
            inputContainerClassName="bg-white"
            onChange={(state) => setPropertyState({ state })}
            required
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={getLocalGovernments(selectedState)}
            id="local_government"
            label="local government"
            value={lga}
            inputContainerClassName="bg-white"
            onChange={(lga) => setPropertyState({ lga })}
            required
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={getCities(selectedState, lga)}
            id="city_area"
            label="City / Area"
            allowCustom={true}
            value={city}
            onChange={(city) => setPropertyState({ city })}
            inputContainerClassName="bg-white"
            required
            hiddenInputClassName="property-form-input"
          />
          <Input
            id="full_address"
            label="Full Address"
            inputClassName="bg-white rounded-[8px] property-form-input"
            required
          />

          <Select
            id="branch_id"
            label="Branch"
            resetKey={resetKey}
            options={branchOptions}
            inputContainerClassName="bg-white"
            onChange={(selectedBranch) => setPropertyState({ selectedBranch })}
            hiddenInputClassName="property-form-input"
          />
          {formType === "rental" && (
            <>
              <Select
                options={inventoryOptions}
                id="inventory_id"
                label="Inventory"
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                hiddenInputClassName="property-form-input"
              />
              <Select
                options={landlordOptions}
                id="land_lord_id"
                label="Landlord"
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                hiddenInputClassName="property-form-input"
              />
            </>
          )}
          <Select
            options={accountOfficerOptions}
            id="account_officer_id"
            label="Account Officer"
            inputContainerClassName="bg-white"
            resetKey={resetKey}
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
            id="description"
            label={
              formType === "rental"
                ? "Property Description"
                : "Estate/Facility Description"
            }
            className="md:col-span-2 lg:col-span-3 dark:text-white !dark:bg-transparent"
            placeholder="Write here"
            resetKey={resetKey}
            required
            hiddenInputClassName="property-form-input"
            inputSpaceClassName="bg-white dark:bg-transparent"
          />
        </div>
        {/* Property Settings */}

        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          {formType === "rental"
            ? "Property Settings"
            : selectedCategory?.toLocaleLowerCase() === "estate"
            ? "Estate Settings"
            : selectedCategory?.toLocaleLowerCase() === "facility"
            ? "Facility Settings"
            : "Estate/Facility Settings"}
        </p>

        <hr className="my-4" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
          <Select
            id={formType === "rental" ? "agency_fee" : "management_fee"}
            label={formType === "rental" ? "Agency Fee" : "Management Fee"}
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
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          {formType === "rental" && (
            <>
              <Select
                id="who_to_charge_new_tenant"
                options={["landlord", "tenants", "both", "none"]}
                label="Who to Charge (New Tenant)"
                isSearchable={false}
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                requiredNoStar
                hiddenInputClassName="property-form-input"
              />
              <Select
                id="who_to_charge_renew_tenant"
                options={["landlord", "tenants", "both", "none"]}
                label="Who to Charge (Renewal Tenant)"
                isSearchable={false}
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                requiredNoStar
                hiddenInputClassName="property-form-input"
              />
            </>
          )}
          {formType === "rental" && (
            <Select
              options={[
                "Keep with Landlord",
                "Keep with Manager",
                "Escrow it",
                "None",
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
            id={formType === "rental" ? "rent_penalty" : "fee_penalty"}
            label={formType === "rental" ? "Rent Penalty" : "Fee Penalty"}
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="request_call_back"
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
            id="vehicle_record"
            label="Vehicle Records"
            isSearchable={false}
            inputContainerClassName="bg-white"
            resetKey={resetKey}
            requiredNoStar
            hiddenInputClassName="property-form-input"
          />
          <Select
            options={["yes", "no"]}
            id="active_vat"
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
        <PropertyFormFooter
          editMode={editMode}
          handleReset={handleReset}
          requestLoading={requestLoading}
        />
      </AuthForm>
    </FlowProgress>
  );
};

export default CreatePropertyForm;
