"use client";

import { comments } from "@/app/(nav)/tasks/agent-community/data";
import TextArea from "../Form/TextArea/textarea";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useState } from "react";
import { ValidationErrors } from "@/utils/types";
import Comment from "@/app/(nav)/tasks/agent-community/threads/[threadId]/preview/comment";
import MultiSelect from "../Form/MultiSelect/multiselect";

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

export const PropertyRequestSecondSection = () => {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary p-4 rounded-lg">
      <h2>Request Types</h2>
      <Select
        id="property-category"
        label="Property Categories"
        options={["Category 1", "Category 2"]}
      />
      <Select
        id="property-type"
        label="Property Type"
        options={["Rental Property", "Gated Estate"]}
      />
      <Select
        id="property-subtype"
        label="Property Sub Type"
        options={["Subtype 1", "Subtype 2"]}
      />
      <Select
        id="bedrooms"
        label="Bedrooms"
        options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
      />
      <Select
        id="land-size"
        label="Land Size"
        options={["Plot", "Square Feet"]}
      />
      <div className="budget flex flex-col gap-2">
        <h3 className="text-black dark:text-white font-semibold mb-2">
          Budget
        </h3>
        <Select
          id="minimum"
          label="Minimum"
          options={["Budget 1", "Budget 2"]}
        />
        <Select
          id="maximum"
          label="Maximum"
          options={["Budget 1", "Budget 2"]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <StateAndLocalGovt />
        <Select
          id="valid-till"
          label="Valid Till"
          options={["1 Month", "2 Months", "3 Months", "4 Months", "5 Months"]}
        />
      </div>
    </div>
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
