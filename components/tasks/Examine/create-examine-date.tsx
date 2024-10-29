import React from "react";

// Types
import type { CreateExamineDateProps } from "./types";

// Images
import { CancelIcon } from "@/public/icons/icons";

// Imports
import Input from "@/components/Form/Input/input";
import Label from "@/components/Form/Label/label";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";

const CreateExamineDate: React.FC<CreateExamineDateProps> = ({ next }) => {
  return (
    <div className="custom-flex-col gap-4 rounded-lg overflow-hidden bg-white w-[600px]">
      <div className="custom-flex-col gap-[2px] py-4 px-6">
        <div className="flex justify-end">
          <button>
            <CancelIcon />
          </button>
        </div>
        <div className="flex justify-center">
          <p className="text-text-secondary text-base font-medium capitalize">
            Create Examine Date
          </p>
        </div>
      </div>
      <div className="custom-flex-col gap-10 px-[18px] pb-8">
        <div className="grid grid-cols-2 gap-y-[18px] gap-x-6">
          <Input
            id="title"
            placeholder="Add Title"
            className="col-span-2"
            style={{ backgroundColor: "white" }}
          />
          <Select
            id="branch"
            label="branch"
            options={["branch 1", "branch 2"]}
          />
          <Select
            id="property"
            label="property"
            options={["property 1", "property 2"]}
          />
          <Select
            id="account-officer"
            label="account officer"
            options={["account officer 1", "account officer 2"]}
          />
          <Input
            id="date"
            type="date"
            label="examine date"
            style={{ backgroundColor: "white" }}
          />
          <div className="custom-flex-col gap-1 col-span-2">
            <Label id="note">Attach note:</Label>
            <textarea
              id="note"
              name="note"
              placeholder="Type here"
              className="p-3 text-xs md:text-sm font-normal rounded-[4px] custom-primary-outline border border-solid border-[#C1C2C366] bg-white dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out resize-none"
            ></textarea>
          </div>
        </div>
        <Button
          onClick={next}
          size="sm_medium"
          className="py-2 px-8"
          style={{ textTransform: "none" }}
        >
          Add to Calendar
        </Button>
      </div>
    </div>
  );
};

export default CreateExamineDate;
