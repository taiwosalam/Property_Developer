"use client";

import { comments } from "@/app/(nav)/tasks/agent-community/data";
import TextArea from "../Form/TextArea/textarea";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useState } from "react";
import { ValidationErrors } from "@/utils/types";
import Comment from "@/app/(nav)/tasks/agent-community/threads/[threadId]/preview/comment";
import MultiSelect from "../Form/MultiSelect/multiselect";
import PropertyRequestUnitType from "./UnitType";
import { PropertyRequestContext } from "./propertyRequest";
import Input from "../Form/Input/input";
import { currencySymbols } from "@/utils/number-formatter";
import { toast } from "sonner";
import { usePropertyRequestStore } from "@/store/createPropertyStore";

export const PropertyRequestFirstSection = ({
  inputValue: initialInputValue,
  title,
  placeholderText,
  desc,
}: {
  inputValue?: string;
  desc?: string;
  title?: string;
  placeholderText: string;
}) => {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <label htmlFor="property-title"> Title </label>
        <input
          type="text"
          id="property-title"
          className="bg-white rounded-md dark:bg-darkText-primary dark:text-darkText-1 py-2 px-3 w-full text-text-secondary"
          value={inputValue}
          onChange={onChange}
        />
      </div>
      <TextArea
        id="property-description"
        label=""
        placeholder={desc ? desc : placeholderText}
        className="w-full mt-4 min-h-[300px]"
        value={desc}
        inputSpaceClassName="!min-h-[400px] text-text-secondary no-italic !leading-60 dark:text-darkText-2"
      />
    </div>
  );
};

// export const PropertyRequestSecondSection = () => {
//   const { minBudget, maxBudget, setMinBudget, setMaxBudget } =
//     usePropertyRequestStore();
//   const [error, setError] = useState<string | null>(null);
//   const CURRENCY_SYMBOL = currencySymbols["NAIRA"];

//   const validateBudgets = (min: number | null, max: number | null) => {
//     if (min !== null && max !== null && min > max) {
//       toast.error("Minimum budget cannot be greater than maximum budget.");
//       setMinBudget(null);
//       setMaxBudget(null);
//     }
//   };

//   // Handle minimum budget change
//   const handleMinChange = (value: string) => {
//     const numValue = parseFloat(value) || null; // Convert input to number or set to null
//     setMinBudget(numValue);
//     validateBudgets(numValue, maxBudget);
//   };

//   // Handle maximum budget change
//   const handleMaxChange = (value: string) => {
//     const numValue = parseFloat(value) || null; // Convert input to number or set to null
//     setMaxBudget(numValue);
//     validateBudgets(minBudget, numValue);
//   };

//   return (
//     <PropertyRequestContext.Provider
//       value={{
//         unitType: "",
//         setUnitType: () => {},
//         images: [],
//         formResetKey: 0,
//       }}
//     >
//       <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary p-4 rounded-lg">
//         <h2>Request Types</h2>
//         <PropertyRequestUnitType />
//         <div className="budget flex flex-col gap-2">
//           <h3 className="text-black dark:text-white font-semibold mb-2">
//             Budget
//           </h3>
//           <Input
//             id="minimum"
//             placeholder=""
//             label="Minimum Budget"
//             formatNumber
//             CURRENCY_SYMBOL={CURRENCY_SYMBOL}
//             inputClassName="bg-white"
//             onChange={handleMinChange}
//             value={minBudget !== null ? minBudget.toString() : ""}
//           />
//           <Input
//             id="maximum"
//             placeholder=""
//             label="Maximum Budget"
//             formatNumber
//             CURRENCY_SYMBOL={CURRENCY_SYMBOL}
//             inputClassName="bg-white"
//             onChange={handleMaxChange}
//             value={maxBudget !== null ? maxBudget.toString() : ""}
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <StateAndLocalGovt />
//           <Select
//             id="valid-till"
//             label="Valid Till"
//             options={[
//               "1 Month",
//               "2 Months",
//               "3 Months",
//               "4 Months",
//               "5 Months",
//             ]}
//           />
//         </div>
//       </div>
//     </PropertyRequestContext.Provider>
//   );
// };

export const PropertyRequestSecondSection = () => {
  const { minBudget, maxBudget, setMinBudget, setMaxBudget } =
    usePropertyRequestStore();
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];

  // Handle minimum budget change
  const handleMinChange = (value: string) => {
    const numValue = parseFloat(value) || null; // Convert input to number or set to null
    setMinBudget(numValue);
  };

  // Handle maximum budget change
  const handleMaxChange = (value: string) => {
    const numValue = parseFloat(value) || null; // Convert input to number or set to null
    setMaxBudget(numValue);
  };

  return (
    <PropertyRequestContext.Provider
      value={{
        unitType: "",
        setUnitType: () => {},
        images: [],
        formResetKey: 0,
      }}
    >
      <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary p-4 rounded-lg">
        <h2>Request Types</h2>
        <PropertyRequestUnitType />
        <div className="budget flex flex-col gap-2">
          <h3 className="text-black dark:text-white font-semibold mb-2">
            Budget
          </h3>
          <Input
            id="minimum"
            placeholder=""
            label="Minimum Budget"
            formatNumber
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            inputClassName="bg-white"
            onChange={handleMinChange}
            value={minBudget !== null ? minBudget.toString() : ""}
          />
          <Input
            id="maximum"
            placeholder=""
            label="Maximum Budget"
            formatNumber
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            inputClassName="bg-white"
            onChange={handleMaxChange}
            value={maxBudget !== null ? maxBudget.toString() : ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <StateAndLocalGovt />
          <Select
            id="valid-till"
            label="Valid Till"
            options={[
              "1 Month",
              "2 Months",
              "3 Months",
              "4 Months",
              "5 Months",
            ]}
          />
        </div>
      </div>
    </PropertyRequestContext.Provider>
  );
};

export const ManagePropertiesComments = () => {
  return (
    <div className="mt-4">
      {comments.map((comment, index) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
};

export const StateAndLocalGovt = () => {
  type Address = "selectedState" | "selectedLGA" | "selectedCity";
  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    // selectedCity: "", // form not looking for city
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });
  const handleAddressChange = (field: Address, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "selectedState" && {
        selectedLGA: "",
        selectedCity: "",
      }),
      ...(field === "selectedLGA" && { selectedCity: "" }),
    }));
  };
  const { selectedState, selectedLGA, errorMsgs } = state;
  return (
    <div className="audience flex flex-col gap-2">
      <h3 className="text-black dark:text-white font-semibold mb-2">
        Target Audience
      </h3>
      <MultiSelect
        options={["All States", ...getAllStates()]}
        maxSelections={10}
        id="states"
        label="Select States (Maximum of 10)"
        // resetKey={formResetKey}
      />
      {/* <Select
        validationErrors={errorMsgs}
        options={getLocalGovernments(selectedState)}
        id="local_government"
        label="local government"
        placeholder="Select options"
        inputContainerClassName="bg-neutral-2"
        onChange={(value) => handleAddressChange("selectedLGA", value)}
        value={selectedLGA}
      /> */}
    </div>
  );
};
