import Input from "@/components/Form/Input/input";
import RestrictInput from "@/components/Form/Input/InputWIthRestrict";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { v4 as uuidv4 } from "uuid";
import {
  getAllCities,
  getAllLocalGovernments,
  getAllStates,
  getCities,
  getLocalGovernments,
} from "@/utils/states";
import { useEffect, useMemo, useState } from "react";
import GoogleMapsModal from "./google-maps";
import { DeleteIconX, PlusIcon } from "@/public/icons/icons";
import FileInput from "@/components/Form/FileInput/file-input";
import MultiSelect from "@/components/Form/MultiSelect/multiselect";
import {
  type UnitTypeKey,
  unitTypes,
  unitSubtypes,
  unitPreferences,
  unitFacilities,
} from "@/data";
import {
  currencySymbols,
  formatCostInputValue,
  formatNumber,
} from "@/utils/number-formatter";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "./draggable-image";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import Button from "@/components/Form/Button/button";
import { useEditPropertyContext } from "@/contexts/editOutrightPropertyContext";

interface PropertyFormStateType {
  state: string;
  city: string;
  lga: string;
  resetKey: number;
}

const maxNumberOfImages = 6;

//  =============== Property Details =====================
export const PropertyDetailsForm = ({ editMode }: { editMode?: boolean }) => {
  const {
    formData,
    updateFormField,
    addAdditionalUnit,
    removeAdditionalUnit,
    updateAdditionalUnit,
  } = useEditPropertyContext();

  const [selectedAreaUnit, setSelectedAreaUnit] = useState(
    formData.measurement || "sqm"
  );
  const [unitTypeOptions, setUnitTypeOptions] = useState<string[]>([]);
  const [unitSubtypeOptions, setUnitSubtypeOptions] = useState<string[]>([]);
  const [unitPreferencesOptions, setUnitPreferencesOptions] = useState<
    string[]
  >([]);

  const areaUnits = ["sqm", "half plot", "plot", "acre", "hectare"];

  useEffect(() => {
    if (
      formData.category &&
      unitTypes[formData.category as keyof typeof unitTypes]
    ) {
      setUnitTypeOptions(
        unitTypes[formData.category as keyof typeof unitTypes]
      );
    } else {
      setUnitTypeOptions([]);
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.unit_type) {
      if (formData.unit_type === "land") {
        if (
          ["commercial", "facility", "mixed use"].includes(formData.category)
        ) {
          setUnitSubtypeOptions(unitSubtypes.land.commercial);
          setUnitPreferencesOptions(unitPreferences.lands.commercial);
        } else {
          setUnitSubtypeOptions(unitSubtypes.land.residential);
          setUnitPreferencesOptions(unitPreferences.lands.residential);
        }
      } else {
        const subtypes =
          unitSubtypes[formData.unit_type as keyof typeof unitSubtypes];
        setUnitSubtypeOptions(
          Array.isArray(subtypes) ? subtypes : unitSubtypes.others
        );
        if (["commercial", "facility"].includes(formData.category)) {
          setUnitPreferencesOptions(unitPreferences.buildings.commercial);
        } else if (formData.category === "mixed use") {
          setUnitPreferencesOptions([
            ...unitPreferences.buildings.residential,
            ...unitPreferences.buildings.commercial,
          ]);
        } else {
          setUnitPreferencesOptions(unitPreferences.buildings.residential);
        }
      }
    } else {
      setUnitSubtypeOptions([]);
      setUnitPreferencesOptions([]);
    }
  }, [formData.unit_type, formData.category]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          Property Details
        </p>
      </div>
      <hr className="my-4" />

      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <Select
          options={Object.keys(unitTypes)}
          id="category"
          label="Category"
          isSearchable={false}
          // value={formData.category}
          defaultValue={editMode ? formData.category : ""}
          onChange={(value) => updateFormField("category", value.toLowerCase())}
          className="property-category-wrapper"
          inputContainerClassName="bg-white"
          required
          hiddenInputClassName="property-form-input"
        />
        <Select
          options={unitTypeOptions}
          id="type"
          label="Type"
          isSearchable={false}
          className="property-category-wrapper"
          inputContainerClassName="bg-white"
          // value={formData.unit_type}
          defaultValue={editMode ? formData.unit_type : ""}
          onChange={(value) =>
            updateFormField("unit_type", value.toLowerCase() as UnitTypeKey)
          }
          required
          hiddenInputClassName="property-form-input"
        />
        {(formData.unit_type?.toLowerCase() !== "land" ||
          ["commercial", "facility", "mixed use"].includes(
            formData.category
          )) && (
          <Select
            options={unitSubtypeOptions}
            id="sub_type"
            label="Sub Type"
            isSearchable={false}
            className="property-category-wrapper"
            inputContainerClassName="bg-white"
            defaultValue={editMode ? formData.unit_sub_type : ""}
            onChange={(value) =>
              updateFormField("unit_sub_type", value.toLowerCase())
            }
            required
            hiddenInputClassName="property-form-input"
          />
        )}
        <Select
          options={unitPreferencesOptions}
          id="preference"
          label="Preference"
          isSearchable={false}
          className="property-category-wrapper"
          inputContainerClassName="bg-white"
          defaultValue={editMode ? formData.unit_preference : ""}
          onChange={(value) =>
            updateFormField("unit_preference", value.toLowerCase())
          }
          required
          hiddenInputClassName="property-form-input"
        />
        <Select
          id="measurement"
          options={areaUnits}
          label="Measurement"
          // value={selectedAreaUnit}
          defaultValue={editMode ? formData.measurement : "sqm"}
          onChange={(value) => {
            setSelectedAreaUnit(value);
            updateFormField("measurement", value);
          }}
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
        />
        <Input
          id="total_area_sqm"
          label="Total Area (m²)"
          labelclassName="undo-text-transform"
          inputClassName="bg-white unit-form-input"
          formatNumber
          requiredNoStar
          endWith="sqm"
          defaultValue={editMode ? formData.total_area_sqm : ""}
          onChange={(value) => updateFormField("total_area_sqm", value)}
        />
        <Input
          id="bedroom"
          label="Bedroom"
          inputClassName="bg-white keep-spinner unit-form-input"
          type="number"
          min={0}
          max={99}
          maxLength={2}
          requiredNoStar
          defaultValue={editMode ? formData.bedroom : ""}
          onChange={(value) => updateFormField("bedroom", value)}
        />
        <Input
          id="bathroom"
          label="Bathroom"
          inputClassName="bg-white keep-spinner unit-form-input"
          type="number"
          min={0}
          max={99}
          maxLength={2}
          requiredNoStar
          defaultValue={editMode ? formData.bathroom : ""}
          onChange={(value) => updateFormField("bathroom", value)}
        />
        <Input
          id="toilet"
          label="Toilet"
          inputClassName="bg-white keep-spinner unit-form-input"
          type="number"
          min={0}
          requiredNoStar
          max={99}
          maxLength={2}
          defaultValue={editMode ? formData.toilet : ""}
          onChange={(value) => updateFormField("toilet", value)}
        />
      </div>

      <div className="flex items-end gap-2 w-full mb-2">
        <div className="w-1/3">
          <Input
            id="total_units"
            label="Total Units"
            inputClassName="bg-white unit-form-input"
            type="number"
            min={1}
            requiredNoStar
            defaultValue={editMode ? formData.total_units : ""}
            onChange={(value) => updateFormField("total_units", value)}
          />
        </div>
        {formData.additional_units.length === 0 && (
          <Button
            type="button"
            variant="sky_blue"
            size="base_medium"
            className="mb-[2px] py-2 px-8"
            onClick={addAdditionalUnit}
          >
            Add More Unit
          </Button>
        )}
      </div>

      {formData.additional_units.map((unit, index) => (
        <MoreUnit
          key={index}
          index={index}
          editMode={editMode}
          unitData={unit}
          propertyCategory={formData.category}
          onRemove={() => removeAdditionalUnit(index)}
          onAdd={addAdditionalUnit}
          isLast={index === formData.additional_units.length - 1}
        />
      ))}

      <TextArea
        id="description"
        label="Property Description"
        className="property-description-wrapper my-6 md:col-span-2 lg:col-span-3 dark:text-white !dark:bg-transparent"
        placeholder="Write here"
        hiddenInputClassName="property-form-input"
        inputSpaceClassName="bg-white dark:bg-transparent"
        value={formData.description}
        onChange={(value) => updateFormField("description", value)}
      />
    </>
  );
};

// ======================== MORE UNIT ================
interface MoreUnitProps {
  index: number;
  unitData: any;
  propertyCategory: string;
  editMode?: boolean;
  onRemove: () => void;
  onAdd: () => void;
  isLast: boolean;
}

export const MoreUnit = ({
  index,
  unitData,
  propertyCategory,
  editMode,
  onRemove,
  onAdd,
  isLast,
}: MoreUnitProps) => {
  const { updateAdditionalUnit } = useEditPropertyContext();
  const [selectedUnitType, setSelectedUnitType] = useState<UnitTypeKey | "">(
    editMode ? unitData?.unit_type || "" : ""
  );
  const [selectedSubtype, setSelectedSubtype] = useState<string>(
    editMode ? unitData?.unit_sub_type || "" : ""
  );
  const [unitTypeOptions, setUnitTypeOptions] = useState<string[]>([]);
  const [unitSubtypeOptions, setUnitSubtypeOptions] = useState<string[]>([]);

  const handleUnitTypeChange = (val: string) => {
    setSelectedUnitType(val.toLowerCase() as UnitTypeKey);
    updateAdditionalUnit(index, "unit_type", val.toLowerCase());
  };

  const handleSubtypeChange = (val: string) => {
    setSelectedSubtype(val.toLowerCase());
    updateAdditionalUnit(index, "unit_sub_type", val.toLowerCase());
  };

  useEffect(() => {
    const category = propertyCategory as keyof typeof unitTypes;
    if (category && category in unitTypes) {
      setUnitTypeOptions(unitTypes[category]);
    } else {
      setUnitTypeOptions([]);
    }
  }, [propertyCategory]);

  useEffect(() => {
    if (selectedUnitType) {
      const subtypes =
        unitSubtypes[selectedUnitType as keyof typeof unitSubtypes];
      setUnitSubtypeOptions(
        Array.isArray(subtypes) ? subtypes : unitSubtypes.others
      );
    } else {
      setUnitSubtypeOptions([]);
      setSelectedSubtype("");
    }
  }, [selectedUnitType]);

  return (
    <div className="relative">
      <hr className="my-4" />
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <Select
          options={unitTypeOptions}
          id={`type_${index}`}
          label="Type"
          isSearchable={false}
          className="property-category-wrapper"
          inputContainerClassName="bg-white"
          defaultValue={editMode ? unitData?.unit_type : ""}
          onChange={handleUnitTypeChange}
          required
          hiddenInputClassName="property-form-input"
        />
        {(selectedUnitType?.toLowerCase() !== "land" ||
          ["commercial", "facility", "mixed use"].includes(
            propertyCategory
          )) && (
          <Select
            options={unitSubtypeOptions}
            id={`sub_type_${index}`}
            label="Sub Type"
            isSearchable={false}
            className="property-category-wrapper"
            inputContainerClassName="bg-white"
            defaultValue={editMode ? unitData?.unit_sub_type : ""}
            onChange={handleSubtypeChange}
            required
            hiddenInputClassName="property-form-input"
          />
        )}
        <Input
          id={`bedroom_${index}`}
          label="Bedroom"
          inputClassName="bg-white keep-spinner unit-form-input"
          type="number"
          min={0}
          max={99}
          maxLength={2}
          requiredNoStar
          defaultValue={editMode ? unitData?.bedroom : ""}
          onChange={(value) => updateAdditionalUnit(index, "bedroom", value)}
        />
        <Input
          id={`bathroom_${index}`}
          label="Bathroom"
          inputClassName="bg-white keep-spinner unit-form-input"
          type="number"
          min={0}
          max={99}
          maxLength={2}
          requiredNoStar
          defaultValue={editMode ? unitData?.bathroom : ""}
          onChange={(value) => updateAdditionalUnit(index, "bathroom", value)}
        />
        <Input
          id={`toilet_${index}`}
          label="Toilet"
          inputClassName="bg-white keep-spinner unit-form-input"
          type="number"
          min={0}
          requiredNoStar
          max={99}
          maxLength={2}
          defaultValue={editMode ? unitData?.toilet : ""}
          onChange={(value) => updateAdditionalUnit(index, "toilet", value)}
        />
        <Input
          id={`total_units_${index}`}
          label="Total Units"
          inputClassName="bg-white unit-form-input"
          type="number"
          min={1}
          requiredNoStar
          defaultValue={editMode ? unitData?.total_units : ""}
          onChange={(value) =>
            updateAdditionalUnit(index, "total_units", value)
          }
        />
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          type="button"
          size="base_medium"
          variant="light_red"
          className="px-8 py-2"
          onClick={onRemove}
        >
          Remove Unit
        </Button>
        {isLast && (
          <Button
            type="button"
            size="base_medium"
            variant="sky_blue"
            className="px-8 py-2"
            onClick={onAdd}
          >
            Add More Unit
          </Button>
        )}
      </div>
    </div>
  );
};

// =============== Property Location =====================
export const PropertyLocation = ({ editMode }: { editMode?: boolean }) => {
  const { formData, updateFormField } = useEditPropertyContext();

  const setPropertyState = (changes: Partial<PropertyFormStateType>) => {
    if (changes.state) {
      updateFormField("state", changes.state);
      updateFormField("lga", "");
      updateFormField("city", "");
    } else if (changes.lga) {
      updateFormField("lga", changes.lga);
      updateFormField("city", "");
    } else if (changes.city) {
      updateFormField("city", changes.city);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          Property Location
        </p>
      </div>
      <hr className="my-4" />
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <Select
          id="state"
          options={getAllStates()}
          label="State"
          value={editMode ? formData.state : ""}
          className="property-state-wrapper"
          inputContainerClassName="bg-white"
          onChange={(state) => setPropertyState({ state })}
          required
          hiddenInputClassName="property-form-input"
        />
        <Select
          options={getLocalGovernments(formData.state)}
          id="local_government"
          label="Local Government"
          value={editMode ? formData.lga : ""}
          inputContainerClassName="bg-white"
          onChange={(lga) => setPropertyState({ lga })}
          required
          hiddenInputClassName="property-form-input"
        />
        <Select
          options={getCities(formData.state, formData.lga)}
          id="city_area"
          label="City / Area"
          allowCustom={true}
          value={editMode ? formData.city : ""}
          onChange={(city) => setPropertyState({ city })}
          inputContainerClassName="bg-white"
          required
          hiddenInputClassName="property-form-input address-wrapper"
        />
        <RestrictInput
          id="full_address"
          label="Street Name/Number"
          inputClassName="bg-white rounded-[8px] property-form-input"
          required
          className="property-street-wrapper"
          value={editMode ? formData.full_address : ""}
          onChange={(value) => updateFormField("full_address", value)}
          restrictedWordsOptions={{
            words: [
              ...getAllStates(),
              ...getAllLocalGovernments(),
              ...getAllCities(),
            ],
          }}
        />
        <div className="coordinate-wrapper flex flex-col gap-2">
          <label>Coordinates</label>
          <div className="flex items-center px-2 h-[44px] text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline bg-white border border-solid border-[#C1C2C366] dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2">
            <Modal>
              <ModalTrigger asChild>
                <button className="capitalize bg-brand-9 text-xs rounded-md px-2 text-white h-3/4">
                  Set Location
                </button>
              </ModalTrigger>
              <ModalContent>
                <GoogleMapsModal
                  setLat={(lat) => updateFormField("lat", lat)}
                  setLng={(lng) => updateFormField("lng", lng)}
                  setCoordinate={(coordinate) =>
                    updateFormField("coordinate", coordinate)
                  }
                  coordinate={editMode ? formData.coordinate : ""}
                />
              </ModalContent>
            </Modal>
            <input
              name="coordinate"
              id="coordinate"
              onChange={(e) => updateFormField("coordinate", e.target.value)}
              value={editMode ? formData.coordinate : ""}
              type="text"
              required
              className="w-full h-full dark:bg-transparent rounded-[4px] outline-none px-2"
            />
            {formData.coordinate && (
              <button
                type="button"
                className="bg-transparent outline-none"
                onClick={() => updateFormField("coordinate", "")}
              >
                <DeleteIconX />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ================ PROPERTY FEATURES ====================
export const PropertyFeatures = () => {
  const propertyCategory = "commercial";
  const facilitiesOptions =
    propertyCategory?.toLowerCase() === "commercial"
      ? unitFacilities.lands
      : unitFacilities.buildings;

  return (
    <>
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          Features
        </p>
      </div>
      <hr className="my-4" />
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
        <Select
          options={["yes", "no"]}
          id="gated_estate"
          label="Gated Estate"
          required
          isSearchable={false}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          //   defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
        />
        <Select
          options={["yes", "no"]}
          id="drainage"
          label="Drainage"
          required
          isSearchable={false}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          //   defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
        />
        <Select
          options={["yes", "no"]}
          id="fence"
          label="Fence"
          required
          isSearchable={false}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          //   defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
        />
        <Select
          options={["yes", "no"]}
          id="interlocking"
          label="Interlocking"
          required
          isSearchable={false}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          //   defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
        />
        <Select
          options={["yes", "no"]}
          id="parking_space"
          label="Parking Space"
          required
          isSearchable={false}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          //   defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
        />
        <MultiSelect
          options={facilitiesOptions}
          maxSelections={
            propertyCategory?.toLowerCase() !== "commercial" ? 10 : undefined
          }
          id="facilities"
          label={`Select Facilities${
            propertyCategory?.toLowerCase() !== "commercial"
              ? " (Maximum of 10)"
              : ""
          }`}
          defaultSelections={[]}
        />
      </div>
    </>
  );
};

// =============== PROPERTY PRICING =================
export const PropertyPricing = ({ editMode }: { editMode?: boolean }) => {
  const { formData, updateFormField } = useEditPropertyContext();
  const CURRENCY_SYMBOL = currencySymbols[formData.currency];

  const initialFormValues = useMemo(
    () => ({
      rentAmount:
        editMode && formData.fee_amount
          ? formatNumber(parseFloat(formData.fee_amount))
          : "",
      inspectionFee:
        editMode && formData.inspection_fee
          ? formatNumber(parseFloat(formData.inspection_fee))
          : "",
      agencyFee:
        editMode && formData.agency_fee
          ? formatNumber(parseFloat(formData.agency_fee))
          : "",
      securityFee:
        editMode && formData.security_fee
          ? formatNumber(parseFloat(formData.security_fee))
          : "",
      serviceCharge:
        editMode && formData.service_charge
          ? formatNumber(parseFloat(formData.service_charge))
          : "",
      totalPackage:
        editMode && formData.total_package
          ? formatNumber(parseFloat(formData.total_package))
          : "",
    }),
    [
      formData.fee_amount,
      formData.inspection_fee,
      formData.agency_fee,
      formData.security_fee,
      formData.service_charge,
      formData.total_package,
    ]
  );

  return (
    <>
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          Price
        </p>
      </div>
      <hr className="my-4" />
      <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
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
          defaultValue={editMode ? formData.currency : "naira"}
          onChange={(val) =>
            updateFormField("currency", val as keyof typeof currencySymbols)
          }
          isSearchable={false}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
        />
        <Input
          id="property_amount"
          label="Property Amount"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          defaultValue={initialFormValues.rentAmount}
          onChange={(value) =>
            updateFormField("fee_amount", formatCostInputValue(value))
          }
          type="text"
          autoComplete="off"
        />
        <Input
          id="inspection_fee"
          label="Inspection Fee"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          defaultValue={initialFormValues.inspectionFee}
          onChange={(value) =>
            updateFormField("inspection_fee", formatCostInputValue(value))
          }
          type="text"
          autoComplete="off"
        />
        <Input
          id="agency_fee"
          label="Management Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          defaultValue={initialFormValues.agencyFee}
          onChange={(value) =>
            updateFormField("agency_fee", formatCostInputValue(value))
          }
          type="text"
          autoComplete="off"
        />
        <Input
          id="other_charges"
          label="Other Charges"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          defaultValue={initialFormValues.serviceCharge}
          onChange={(value) =>
            updateFormField("service_charge", formatCostInputValue(value))
          }
          type="text"
          autoComplete="off"
        />
        <Select
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          id="negotiation"
          label="Are you open for negotiations"
          isSearchable={false}
          className="property-book-visitors-wrapper"
          inputContainerClassName="bg-white"
          defaultValue={editMode ? formData.negotiation : "no"}
          onChange={(value) => updateFormField("negotiation", value)}
          requiredNoStar
          hiddenInputClassName="property-form-input"
        />
      </div>
    </>
  );
};

// =============== PROPERTY SETTINGS ==============
export const PropertySettings = ({ editMode }: { editMode?: boolean }) => {
  const { formData, updateFormField } = useEditPropertyContext();

  return (
    <div>
      <div className="flex gap-2 items-center">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          Property Settings
        </p>
      </div>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
        <Select
          id="branch"
          label="Branch"
          options={["Branch 1", "Branch 2"]}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          defaultValue={editMode ? formData.branch : ""}
          onChange={(value) => updateFormField("branch", value)}
        />
        <Select
          id="account_manager"
          label="Account Manager"
          options={["Manager 1", "Manager 2"]}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          defaultValue={editMode ? formData.account_manager : ""}
          onChange={(value) => updateFormField("account_manager", value)}
        />
        <Select
          id="owner_source"
          label="Owner/Source"
          options={["owner 1", "source 2"]}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          defaultValue={editMode ? formData.owner_source : ""}
          onChange={(value) => updateFormField("owner_source", value)}
        />
        <Select
          id="activate_vat"
          label="Activate 7.5% VAT"
          options={["yes", "no"]}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          defaultValue={editMode ? formData.activate_vat : "no"}
          onChange={(value) => updateFormField("activate_vat", value)}
        />
        <Select
          id="activate_joint_sales"
          label="Activate Joint Sales"
          options={["yes", "no"]}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          defaultValue={editMode ? formData.activate_joint_sales : "no"}
          onChange={(value) => updateFormField("activate_joint_sales", value)}
        />
        <Select
          id="staff"
          label="Staff"
          options={["staff 1", "staff 2"]}
          inputContainerClassName="bg-white"
          requiredNoStar
          hiddenInputClassName="property-form-input"
          defaultValue={editMode ? formData.staff : ""}
          onChange={(value) => updateFormField("staff", value)}
        />
      </div>
    </div>
  );
};

// ============== PROPERTY IMAGES ====================
export const PropertyImages = ({ editMode }: { editMode?: boolean }) => {
  const { formData, updateFormField } = useEditPropertyContext();

  // Convert formData.images to string[] for initialImages, filtering out File objects
  const initialImages = useMemo(
    () =>
      editMode
        ? formData.images.filter(
            (img): img is string => typeof img === "string"
          )
        : [],
    [editMode, formData.images]
  );

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
    initialImages,
    onImagesUpdate: ({ imageFiles }) => {
      updateFormField("images", imageFiles);
    },
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
    <div>
      <div className="flex gap-2 items-center mt-8">
        <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
          <span className="text-status-error-primary">*</span>
          Property Pictures
        </p>
      </div>
      <hr className="my-4" />
      <div className="mb-5 lg:mb-8 property-picture-upload-wrapper">
        <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
          Set Property pictures for easy recognition (maximum of{" "}
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
                {sortableImages.length > 0 &&
                  sortableImages.map((s) => (
                    <DraggableImage
                      key={s.id}
                      id={s.id}
                      image={s.image}
                      index={s.index}
                      removeImage={(index) => {
                        removeImage(index);
                      }}
                    />
                  ))}
                {provided.placeholder}
                {images.length < maxNumberOfImages && (
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
      <div className="youtube-video-link-wrapper md:grid md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="video_link"
          label="Video Link"
          type="url"
          className="mb-5"
          placeholder="https://www.youtube.com/video"
          inputClassName="bg-white rounded-[8px] md:col-span-1"
          defaultValue={editMode ? formData.video_link : ""}
          onChange={(value) => updateFormField("video_link", value)}
        />
      </div>
    </div>
  );
};
