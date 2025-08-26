import Input from "@/components/Form/Input/input";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "./draggable-image";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import { v4 as uuidv4 } from "uuid";
import { DeleteIconX, PlusIcon } from "@/public/icons/icons";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import GoogleMapsModal from "./google-maps";
import { useState } from "react";
import {
  getAllCities,
  getAllLocalGovernments,
  getAllStates,
  getCities,
  getLocalGovernments,
} from "@/utils/states";
import RestrictInput from "@/components/Form/Input/InputWIthRestrict";
import MultiSelect from "@/components/Form/MultiSelect/multiselect";
import { currencySymbols } from "@/utils/number-formatter";
import { rentPeriods } from "@/data";
import FileInput from "@/components/Form/FileInput/file-input";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import { agreements } from "./data";

const maxNumberOfImages = 6;
// ===================== PROPERTY IMAGES =====================
export const InstallmentPropertyImages = () => {
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
    initialImages: [],
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

  return (
    <>
      <div className="mb-5 lg:mb-8 property-picture-upload-wrapper">
        <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
          Set property pictures for easy recognition (maximum of{" "}
          {maxNumberOfImages} images). Please drag your preferred image and
          place it in the first position to make it the primary display.
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
      {/* Video Link */}
      <div className="youtube-video-link-wrapper md:grid md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="video_link"
          label="Video Link"
          type="url"
          className="mb-5"
          placeholder="https://www.youtube.com/video "
          inputClassName="bg-white rounded-[8px] md:col-span-1"
        />
      </div>
    </>
  );
};

// =============== INSTALLMENT PROPERTY DETAILS ===============
export const InstallmentPropertyDetails = () => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [coordinate, setCoordinate] = useState("");
  const [location, setLocation] = useState<{
    state: string | null;
    lga: string | null;
    city: string | null;
  }>({
    state: null,
    lga: null,
    city: null,
  });

  const handleChange = (
    field: "state" | "lga" | "city",
    value: string | null
  ) => {
    setLocation((prev) => {
      if (field === "state") {
        // reset lga + city if state changes
        return { state: value, lga: null, city: null };
      }
      if (field === "lga") {
        // reset city if lga changes
        return { ...prev, lga: value, city: null };
      }
      return { ...prev, city: value };
    });
  };

  return (
    <div>
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          Property Details
        </p>
      </div>
      <hr className="my-4" />
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <Select
          options={["category 1", "category 2"]}
          id="category"
          label="Category"
          isSearchable={false}
          className="property-category-wrapper"
          inputContainerClassName="bg-white"
          required
          hiddenInputClassName="property-form-input"
        />
        <Input
          id="title"
          label="Property Title/Estate Name"
          inputClassName="bg-white dark:bg-darkText-primary rounded-[8px] property-form-input"
          required
          className="property-name-wrapper"
        />

        {/* State */}
        <Select
          id="state"
          options={getAllStates()}
          label="State"
          value={location.state ?? ""}
          onChange={(val) => handleChange("state", val)}
          required
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />

        {/* Local Government */}
        <Select
          id="local_government"
          options={location.state ? getLocalGovernments(location.state) : []}
          label="Local Government"
          value={location.lga ?? ""}
          onChange={(val) => handleChange("lga", val)}
          disabled={!location.state}
          required
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />

        {/* City */}
        <Select
          id="city_area"
          options={
            location.state && location.lga
              ? getCities(location.state, location.lga)
              : []
          }
          label="City / Area"
          value={location.city ?? ""}
          onChange={(val) => handleChange("city", val)}
          disabled={!location.lga}
          required
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input address-wrapper"
        />

        <RestrictInput
          id="full_address"
          label="Street Name/Number"
          inputClassName="bg-white rounded-[8px] property-form-input"
          required
          className="property-street-wrapper"
          restrictedWordsOptions={{
            words: [
              ...getAllStates(),
              ...getAllLocalGovernments(),
              ...getAllCities(),
            ],
          }}
        />

        <>
          <div className="coordinate-wrapper flex flex-col gap-2">
            <label> Coordinates </label>
            <div className="flex items-center px-2 h-[44px] text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline bg-white border border-solid border-[#C1C2C366] dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2">
              <Modal>
                <ModalTrigger asChild>
                  <button className="capitalize bg-brand-9 text-xs rounded-md px-2 text-white h-3/4">
                    Set Location
                  </button>
                </ModalTrigger>
                <ModalContent>
                  <GoogleMapsModal
                    setLat={setLat}
                    setLng={setLng}
                    setCoordinate={setCoordinate}
                    coordinate={coordinate as string}
                  />
                </ModalContent>
              </Modal>
              <input
                name="coordinate"
                id="coordinate"
                onChange={(e) => setCoordinate(e.target.value)}
                value={coordinate}
                type="text"
                className="w-full h-full dark:bg-transparent rounded-[4px] outline-none px-2"
              />
              {coordinate && (
                <button
                  type="button"
                  className="bg-transparent outline-none"
                  onClick={(e) => {
                    const previousSibling = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    if (previousSibling) {
                      setCoordinate("");
                      previousSibling.value = "";
                      e.stopPropagation();
                    } else {
                      console.warn("Previous sibling does not exist.");
                    }
                  }}
                >
                  <DeleteIconX />
                </button>
              )}
            </div>
          </div>
        </>
        {/* Branch */}
        <Select
          id="branch_id"
          required
          label="Branch"
          className="property-branch-wrapper"
          options={["branch 1", "branch 2"]}
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />

        {/* Investor */}
        <SelectWithImage
          options={["option 1", "option 2"]}
          id="investor"
          label="Investor"
          className="property-investor-wrapper"
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />

        {/* Account Manager */}
        <SelectWithImage
          options={["option 1", "option 2"]}
          id="account_officer_id"
          label="Account Manager"
          className="property-officer-wrapper"
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />

        {/* Other Staff - Use memoized options and stable handlers */}
        <div className="property-staff-wrapper bg-transparent flex flex-col gap-2 self-end">
          <label className="text-text-label dark:text-darkText-2">Staff</label>
          <MultiSelect
            id="staffs"
            options={["staff 1", "staff 2"]}
            className="property-staff-wrapper bg-white dark:bg-darkText-primary dark:border dark:border-solid dark:border-[#C1C2C366] hover:bg-white dark:hover:bg-darkText-primary text-black dark:text-white py-3"
          />
        </div>

        <TextArea
          id="description"
          label="Property Description"
          className="property-description-wrapper md:col-span-2 lg:col-span-3 dark:text-white !dark:bg-transparent"
          placeholder="Write here"
          hiddenInputClassName="property-form-input"
          inputSpaceClassName="bg-white dark:bg-transparent"
        />
      </div>
    </div>
  );
};

// ================ INSTALLMENT PROPERTY SETTINGS ================
export const InstallmentPropertySettings = () => {
  const CURRENCY_SYMBOL = currencySymbols["naira"];
  const PERCENTAGES = [
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
  ];
  return (
    <div className="property-settings-wrapper">
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          Property Settings
        </p>
      </div>
      <hr className="my-4" />
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <Input
          id="investor_capital"
          label="Investor Capital"
          required
          inputClassName="bg-white property-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          formatNumber
          autoComplete="off"
        />
        <Select
          id="return_percentage"
          label="Return Percentage"
          options={PERCENTAGES}
          isSearchable={false}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="return_duration"
          label="Return Duration"
          options={rentPeriods}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="allow_referal"
          label="Allow Referral"
          options={["yes", "no"]}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="referral_percentage"
          label="Referral Percentage"
          options={PERCENTAGES}
          isSearchable={false}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="return_duration"
          label="Return Duration"
          options={rentPeriods}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          options={Object.entries(currencySymbols).map(([key, symbol]) => ({
            value: key.toLowerCase(),
            label: `${symbol} ${
              key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
            }`,
          }))}
          id="currency"
          label="Currency"
          className="property-currency-wrapper"
          isSearchable={false}
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="group_chat"
          label="Group Chat"
          options={["yes", "no"]}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="callback"
          label="Request Callback"
          options={["yes", "no"]}
          inputContainerClassName="bg-white"
          className="property-agency-fee-wrapper"
          hiddenInputClassName="property-form-input"
        />
        <Select
          options={["yes", "no"]}
          id="active_vat"
          className="property-active-vat-wrapper"
          label="Activate 7.5% VAT"
          isSearchable={false}
          inputContainerClassName="bg-white"
          hiddenInputClassName="property-form-input"
        />
      </div>
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-5 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <FileInput
          id="agreement_deed"
          label="Agreement/Deed"
          placeholder="Upload File"
          //   buttonName="Document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          hiddenInputClassName="property-form-input"
          // defaultValue={data.agreement_deed}
        />
        <FileInput
          id="survey_plan"
          label="Survey Plan"
          placeholder="Upload File"
          buttonName="Document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          hiddenInputClassName="property-form-input"
          // defaultValue={data.agreement_deed}
        />
        <FileInput
          id="building_plan"
          label="Building Plan"
          placeholder="Upload File"
          buttonName="Document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          hiddenInputClassName="property-form-input"
          // defaultValue={data.agreement_deed}
        />
        <FileInput
          id="cofo"
          label="CofO"
          placeholder="Upload File"
          buttonName="Document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          hiddenInputClassName="property-form-input"
          // defaultValue={data.agreement_deed}
        />
        <FileInput
          id="other_document"
          label="Other Document"
          placeholder="Upload File"
          buttonName="Document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          hiddenInputClassName="property-form-input"
          // defaultValue={data.agreement_deed}
        />
      </div>
    </div>
  );
};

// ================ INSTALLMENT PROPERTY TERMS ===================
export const InstallmentPropertyTerms = () => {
  return (
    <div className="property-settings-wrapper">
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          Property Terms
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex my-8">
        <p className="text-text-disabled dark:text-darkText-disabled">
          These rules, terms, and conditions govern the management of the
          Property, clients and units. You have the flexibility to create these
          rules according to your preferences under the &apos;Documents&apos; section.
          Simply click on them here to apply them to every unit based on their
          applicability.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Dynamically mapped agreements */}
        {agreements.map((agreement, idx) => (
          <DocumentCheckbox key={idx} title={agreement.title}>
            {agreement.desc}
          </DocumentCheckbox>
        ))}
      </div>
    </div>
  );
};
