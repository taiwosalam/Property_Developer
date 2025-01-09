"use client";

// Types
import type {
  CreatePropertyFormProps,
  PropertyFormStateType,
  AllBranchesResponse,
  AllLandlordsResponse,
  AllInventoryResponse,
} from "./types";
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
import { propertyCategories } from "@/data";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  getAllStaffByBranch,
  property_form_state_data,
  transformPropertyFormData,
} from "./data";
import { currencySymbols } from "@/utils/number-formatter";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import PropertyFormFooter from "./property-form-footer.tsx";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";
import clsx from "clsx";
import { useAddUnitStore } from "@/store/add-unit-store";

const maxNumberOfImages = 6;

type SetPropertyStateChanges = Partial<{
  [K in keyof PropertyFormStateType]: PropertyFormStateType[K];
}>;

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  editMode,
  handleSubmit,
  formType,
  propertyId,
  onAddUnit,
}) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const [state, setState] = useState<PropertyFormStateType>(
    property_form_state_data
  );

  console.log(propertyDetails);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    state: selectedState,
    lga,
    city,
    selectedBranch,
    staff,
    staffOptions,
    accountOfficerOptions,
    resetKey,
  } = state;

  const selectedBranchId = selectedBranch.value;
  console.log("selected branch", selectedBranch)

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
    initialImages: editMode
      ? propertyDetails?.images.map((img) => img.path)
      : [],
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
      state: editMode ? propertyDetails?.state || "" : "",
      lga: editMode ? propertyDetails?.local_govt || "" : "",
      city: editMode ? propertyDetails?.city || "" : "",
      staff: [],
    }));
    resetImages();
    setSelectedCategory(null);
  };

  const {
    data: branchesData,
    loading: branchesLoading,
    error: branchesError,
  } = useFetch<AllBranchesResponse>("/branches/select");

  const {
    data: landlordsData,
    loading: landlordsLoading,
    error: landlordsError,
  } = useFetch<AllLandlordsResponse>("/landlord/select");

  const {
    data: inventoryData,
    loading: inventoryLoading,
    error: inventoryError,
  } = useFetch<AllInventoryResponse>(`/inventories/select/${selectedBranchId}`);

  const branchOptions =
    branchesData?.data.map((branch) => ({
      value: branch.id,
      label: branch.branch_name,
    })) || [];

  const landlordOptions =
    landlordsData?.data.map((landlord) => ({
      value: landlord.id,
      label: landlord.name,
    })) || [];

  const inventoryOptions =
    inventoryData?.data.map((inventory) => ({
      value: inventory.id,
      label: inventory.title,
    })) || [];

  useEffect(() => {
    if (!selectedBranch.value) return;
    const fetchStaff = async () => {
      const staffMembers = await getAllStaffByBranch(selectedBranch.value);
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

  useEffect(() => {
    if (editMode && propertyDetails) {
      setState((x) => ({
        ...x,
        state: propertyDetails.state || "",
        lga: propertyDetails.local_govt || "",
        city: propertyDetails.city || "",
        selectedBranch: {
          value: propertyDetails.branch_id || "",
          label: propertyDetails.branch_name || "",
        },
      }));
    }
  }, [propertyDetails, editMode]);

  const yesNoFields = [
    "group_chat",
    "rent_penalty",
    "fee_penalty",
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
      key="property-form-progress"
      steps={1}
      activeStep={0}
      inputClassName="property-form-input"
      showProgressBar={false}
      className={clsx({
        "p-6 bg-white dark:bg-darkText-primary rounded-2xl": editMode,
      })}
    >
      <AuthForm
        onFormSubmit={handleFormSubmit}
        // id={editMode ? "edit-property-form" : "create-property-form"}
        skipValidation
      >
        <div className="max-w-[970px]">
          <input name="property_type" type="hidden" value={formType} />
          <div className="mb-5 lg:mb-8">
            <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
              Set {formType === "rental" ? "property" : "Estate/Facility"}{" "}
              pictures for easy recognition (maximum of {maxNumberOfImages}{" "}
              images). Please drag your preferred image and place it in the
              first position to make it the primary display.
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
                defaultValue={
                  editMode ? propertyDetails?.video_link : undefined
                }
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
              defaultValue={editMode ? propertyDetails?.category : undefined}
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
              inputClassName="bg-white dark:bg-darkText-primary rounded-[8px] property-form-input"
              required
              defaultValue={
                editMode ? propertyDetails?.property_title : undefined
              }
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
              defaultValue={
                editMode ? propertyDetails?.full_address : undefined
              }
            />

            <Select
              options={landlordOptions}
              id="land_lord_id"
              label="Landlord"
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              defaultValue={
                editMode && propertyDetails?.land_lord_id
                  ? landlordOptions.find(
                    (landlord) => landlord.value === propertyDetails.land_lord_id
                  )
                  : undefined
              }
              hiddenInputClassName="property-form-input"
              placeholder={
                landlordsLoading
                  ? "Loading landlords..."
                  : landlordsError
                    ? "Error loading landlords"
                    : "Select landlord"
              }
              error={landlordsError}
            />

            <Select
              id="branch_id"
              required
              label="Branch"
              resetKey={resetKey}
              options={branchOptions}
              inputContainerClassName="bg-white"
              onChange={(selectedBranchId) =>
                setPropertyState({
                  selectedBranch: {
                    value: selectedBranchId,
                    label:
                      branchOptions.find(
                        (branch) =>
                          String(branch.value) === String(selectedBranchId)
                      )?.label || "",
                  },
                })
              }
              value={selectedBranch}
              hiddenInputClassName="property-form-input"
              placeholder={
                branchesLoading
                  ? "Loading branches..."
                  : branchesError
                    ? "Error loading branches"
                    : "Select branch"
              }
              error={branchesError}
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
                  placeholder={
                    inventoryLoading
                      ? "Loading inventories..."
                      : inventoryError
                        ? "Error loading inventories"
                        : "Select inventory"
                  }
                  error={inventoryError}
                />
                {/* <Select
                  options={landlordOptions}
                  id="land_lord_id"
                  label="Landlord"
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  defaultValue={
                    editMode && propertyDetails?.land_lord_id
                      ? landlordOptions.find(
                          (landlord) => landlord.value === propertyDetails.land_lord_id
                        )
                      : undefined
                  }
                  hiddenInputClassName="property-form-input"
                  placeholder={
                    landlordsLoading
                      ? "Loading landlords..."
                      : landlordsError
                      ? "Error loading landlords"
                      : "Select landlord"
                  }
                  error={landlordsError}
                /> */}
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
              defaultValue={editMode ? propertyDetails?.description : undefined}
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
              defaultValue={
                editMode && formType === "rental"
                  ? `${propertySettings?.agency_fee}%`
                  : editMode && formType === "facility"
                    ? `${propertySettings?.management_fee}%`
                    : "5%"
              }
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
                  defaultValue={
                    editMode
                      ? propertySettings?.who_to_charge_new_tenant
                      : "tenants"
                  }
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
                  defaultValue={
                    editMode
                      ? propertySettings?.who_to_charge_renew_tenant
                      : "landlord"
                  }
                />
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
                  defaultValue={
                    editMode ? propertySettings?.caution_deposit : "Escrow it"
                  }
                />
              </>
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
              defaultValue={
                editMode
                  ? propertySettings?.group_chat
                  : formType === "rental"
                    ? "no"
                    : "yes"
              }
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
              defaultValue={
                editMode && formType === "rental"
                  ? propertySettings?.rent_penalty
                  : editMode && formType === "facility"
                    ? propertySettings?.fee_penalty
                    : "no"
              }
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
              defaultValue={
                editMode ? propertySettings?.request_callback : "no"
              }
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
              defaultValue={
                editMode
                  ? propertySettings?.book_visitors
                  : formType === "rental"
                    ? "no"
                    : "yes"
              }
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
              defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
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
              defaultValue={editMode ? propertySettings?.VAT : "no"}
            />
            {formType === "rental" && (
              <>
                <Select
                  options={Object.entries(currencySymbols).map(
                    ([key, symbol]) => ({
                      value: key.toLowerCase(),
                      label: `${symbol} ${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
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
                  defaultValue={
                    editMode && propertySettings?.currency
                      ? {
                        value: propertySettings.currency,
                        label: `${currencySymbols[propertySettings.currency]
                          } ${propertySettings.currency.charAt(0).toUpperCase() +
                          propertySettings.currency.slice(1).toLowerCase()
                          }`,
                      }
                      : {
                        value: "naira",
                        label: `${currencySymbols.naira} Naira`,
                      }
                  }
                />
                <Input
                  id="coordinate"
                  label="Cordinates"
                  inputClassName="bg-white rounded-[8px]"
                  defaultValue={
                    editMode ? propertySettings?.coordinate : undefined
                  }
                />
              </>
            )}
          </div>
        </div>

        <PropertyFormFooter
          editMode={editMode}
          handleReset={handleReset}
          requestLoading={requestLoading}
          propertyId={propertyId}
          onAddUnit={onAddUnit}
        />
      </AuthForm>
    </FlowProgress>
  );
};

export default CreatePropertyForm;
