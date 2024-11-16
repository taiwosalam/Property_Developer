"use client";

import { comments } from "@/app/(nav)/tasks/agent-community/data";
import TextArea from "../Form/TextArea/textarea";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useState } from "react";
import { ValidationErrors } from "@/utils/types";
import MultiSelect from "./multi-select";
import Comment from "@/app/(nav)/tasks/agent-community/threads/[threadId]/preview/comment";
import PropertyRequestUnitType from "./UnitType";
import { PropertyRequestContext } from "./propertyRequest";
import Input from "../Form/Input/input";
import { currencySymbols } from "@/utils/number-formatter";
import { toast } from "sonner";
import { usePropertyRequestStore } from "@/store/createPropertyStore";
import { DatePickerWithRange } from "../dashboard/date-picker";
import { DateRange } from "react-day-picker";

export const PropertyRequestFirstSection = ({
  inputValue: initialInputValue = '',
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
        <label htmlFor="title"> Title </label>
        <input
          type="text"
          id="title"
          name="title"
          className="bg-white rounded-md dark:bg-darkText-primary dark:text-darkText-1 py-2 px-3 w-full text-text-secondary"
          value={inputValue || ''}
          onChange={onChange}
        />
      </div>
      <TextArea
        id="content"
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
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
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

  const [timeRange, setTimeRange] = useState("90d");

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    // If the user selects a custom range, set the timeRange to "custom"
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
  };

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
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
            required
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
            required
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
          <div className="flex flex-col gap-2">
            <h3 className="text-black dark:text-white font-semibold mb-2">
              Valid Till
            </h3>
            <DatePickerWithRange
              id="valid-till"
              className="w-full border border-gray-200 rounded-md"
              selectedRange={selectedDateRange}
              onDateChange={handleDateChange}
            />
          </div>
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
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleStateSelection = (selected: string[]) => {
    // Update selectedStates based on selection
    if (selected.includes("All States")) {
      setSelectedStates(["All States"]);
    } else {
      setSelectedStates(selected);
    }
  };

  return (
    <div className="audience flex flex-col gap-2">
      <h3 className="text-black dark:text-white font-semibold mb-2">
        Target Audience
      </h3>
      <MultiSelect
        name="target_audience"
        options={
          selectedStates.includes("All States")
            ? ["All States"] // Only show "All States" when it’s selected
            : ["All States", ...getAllStates()]
        }
        maxSelections={selectedStates.includes("All States") ? 1 : 10}
        id="target_audience"
        label="Select States (Maximum of 10)"
        required
        onSelectionChange={handleStateSelection}
      />
    </div>
  );
};
