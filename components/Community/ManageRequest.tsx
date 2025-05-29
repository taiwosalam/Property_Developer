"use client";

// import { comments } from "@/app/(nav)/management/agent-community/data";
import TextArea from "../Form/TextArea/textarea";
import Select from "../Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useState, useEffect } from "react";
import { ValidationErrors } from "@/utils/types";
import MultiSelect from "./multi-select";
import Comment from "@/app/(nav)/management/agent-community/threads/[threadId]/preview/comment";
import PropertyRequestUnitType from "./UnitType";
import { PropertyRequestContext } from "./propertyRequest";
import Input from "../Form/Input/input";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { toast } from "sonner";
import { usePropertyRequestStore } from "@/store/createPropertyStore";
import { DatePickerWithRange } from "../dashboard/date-picker";
import { DateRange } from "react-day-picker";
import { comments } from "@/app/(nav)/accountant/management/agent-community/data";
import AgentRequestLoader from "../Loader/agent-reuest";
import { RESTRICTED_ARTICLES_WORDS } from "@/app/(nav)/management/agent-community/my-articles/data";
import { useGlobalStore } from "@/store/general-store";

const SkeletonBox = ({ className }: { className: string }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
    style={{ animation: "pulse 1.5s ease-in-out infinite" }}
  />
);

export const PropertyRequestFirstSection = ({
  data,
  placeholderText,
  desc,
  loading,
  noMaxTitle
}: {
  data?: any;
  desc?: string;
  title?: string;
  placeholderText: string;
  loading?: boolean;
  noMaxTitle?: boolean;
}) => {
  const [inputValue, setInputValue] = useState(data?.title ?? "");
  const [error, setError] = useState<string | null>(null);
  const MAX_LENGTH = noMaxTitle ? Infinity : 40;

  useEffect(() => {
    if (data?.title) {
      setInputValue(data.title.slice(0, MAX_LENGTH));
    }
  }, [data?.title]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_LENGTH) {
      setInputValue(newValue);
      setError(null);
    } else {
      setError(`Title cannot exceed ${MAX_LENGTH} characters`);
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <SkeletonBox className="h-6 w-16" />
          <SkeletonBox className="h-10 w-full" />
        </div>
        <SkeletonBox className="w-full h-[400px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <label htmlFor="title"> Title {!noMaxTitle && <span className="text-slate-400">(Optional)</span>}</label>
        <input
          type="text"
          id="title"
          name="title"
          maxLength={!noMaxTitle ? MAX_LENGTH : undefined}
          className="bg-white border border-solid border-[#C1C2C366] rounded-md dark:bg-darkText-primary dark:text-darkText-1 py-2 px-3 w-full text-text-secondary"
          value={inputValue}
          onChange={onChange}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <TextArea
        id="content"
        label=""
        placeholder={desc ? desc : placeholderText}
        className="w-full mt-4 min-h-[200px]"
        value={data?.content || data?.description || ""}
        restrictedWords={RESTRICTED_ARTICLES_WORDS}
        inputSpaceClassName="!min-h-[400px] text-text-secondary no-italic !leading-60 dark:text-darkText-2"
      />
    </div>
  );
};

export const PropertyRequestSecondSection = ({
  loading,
  data,
}: {
  loading?: boolean;
  data?: any;
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const { minBudget, maxBudget, setMinBudget, setMaxBudget } =
    usePropertyRequestStore();
  const [timeRange, setTimeRange] = useState("90d");
  const stateOptions = getAllStates();
  const [address, setAddress] = useState({
    state: "",
    lga: "",
    city: "",
  });
  const CURRENCY_SYMBOL = currencySymbols.naira;

  if (loading) return <AgentRequestLoader />;

  // Handle minimum budget change
  const handleMinChange = (value: string) => {
    if (!value) {
      setMinBudget(null);
      return;
    }
    // Remove all commas and non-numeric characters except decimal
    const cleanValue = value.replace(/[^\d.]/g, "");
    // Convert to number, handle invalid input
    const numValue = Number(cleanValue);
    if (!isNaN(numValue)) {
      setMinBudget(numValue);
    }
  };

  //

  // Handle maximum budget change
  const handleMaxChange = (value: string) => {
    if (!value) {
      setMaxBudget(null);
      return;
    }
    const cleanValue = value.replace(/[^\d.]/g, "");
    const numValue = parseFloat(cleanValue);
    setMaxBudget(numValue);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    // If the user selects a custom range, set the timeRange to "custom"
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
  };

  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { lga: "", city: "" }),
      ...(key === "lga" && { city: "" }),
    }));
  };

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary p-4 rounded-lg">
      <h3 className="text-black dark:text-white font-semibold mb-2">
        Request Type
      </h3>
      <PropertyRequestUnitType data={data} />
      <div className="budget flex flex-col gap-2">
        <h3 className="text-black dark:text-white font-semibold mb-2">
          Client Budget
        </h3>

        <Input
          required
          id=""
          placeholder=""
          label="Minimum Budget"
          formatNumber
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          inputClassName="bg-white"
          onChange={(value: string) => handleMinChange(value)}
          value={minBudget ? minBudget.toLocaleString() : ""}
        />
        <input
          id="min_budget"
          type="hidden"
          name="min_budget"
          defaultValue={minBudget ? minBudget.toString() : ""}
        />

        <Input
          required
          id=""
          placeholder=""
          label="Maximum Budget"
          //formatNumber
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          inputClassName="bg-white"
          onChange={(value: string) => handleMaxChange(value)}
          value={maxBudget ? maxBudget.toLocaleString() : ""}
        />
        <input
          id="max_budget"
          type="hidden"
          name="max_budget"
          defaultValue={maxBudget ? maxBudget.toString() : ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-black dark:text-white font-semibold mb-2">
          Location
        </h3>
        <Select
          options={stateOptions}
          id="state"
          label="state"
          value={data?.state || address.state}
          onChange={(value) => handleAddressChange("state", value)}
          required
        />

        <Select
          options={getLocalGovernments(address.state)}
          id="lga"
          label="local government"
          onChange={(value) => handleAddressChange("lga", value)}
          value={data?.lga || address.lga}
          required
        />
        {/* <StateAndLocalGovt data={data} /> */}
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-black dark:text-white font-semibold mb-2">
            Valid Till
          </h3>
          <DatePickerWithRange
            id="valid_till"
            className="w-full border border-gray-200 rounded-md"
            selectedRange={selectedDateRange}
            onDateChange={handleDateChange}
          />
        </div>
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

export const StateAndLocalGovt = ({ data }: { data?: any }) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  useEffect(() => {
    //

    const initialSelectedStates = (() => {
      if (typeof data?.target_audience === "string") {
        try {
          // Attempt to parse as JSON
          const parsed = JSON.parse(data.target_audience);
          if (Array.isArray(parsed)) {
            return parsed.map((state: string) => state.trim());
          }
        } catch (e) {
          // If parsing fails, fall back to splitting by commas
          return data.target_audience
            .split(",")
            .map((state: string) => state.trim());
        }
      } else if (Array.isArray(data?.target_audience)) {
        return data.target_audience.map((state: string) => state.trim());
      }
      return [];
    })();

    //
    setSelectedStates(initialSelectedStates);
  }, [data?.target_audience]);

  const handleStateSelection = (selected: string[]) => {
    if (selected.includes("All States")) {
      setSelectedStates(["All States"]); // Only "All States" can be selected
    } else {
      setSelectedStates(selected);
    }
  };

  const allOptions = selectedStates.includes("All States")
    ? ["All States"] // Limit options to "All States" when selected
    : ["All States", ...getAllStates()].filter(
        (option, index, self) => self.indexOf(option) === index // Remove duplicates
      );

  return (
    <div className="audience flex flex-col gap-2">
      <h3 className="text-black dark:text-white font-semibold mb-2">
        Target Audience
      </h3>
      <MultiSelect
        defaultValue={selectedStates}
        name="target_audience"
        options={allOptions}
        maxSelections={selectedStates.includes("All States") ? 1 : 3}
        id="target_audience"
        label="Select States"
        required
        onSelectionChange={handleStateSelection}
      />
    </div>
  );
};
