"use client";

import React from "react";

// Images
import PlusAvatar from "@/public/global/plus-avatar.svg";

// Imports
import { getAllStates } from "@/utils/states";
import Input from "@/components/Form/Input/input";
import Label from "@/components/Form/Label/label";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { useImageUploader } from "@/hooks/useImageUploader";
import { SectionSeparator } from "@/components/Section/section-components";
import { ResponseType } from "@/app/(nav)/management/staff-branch/[branchId]/types";

const EditBranchForm = ({ somedata }: { somedata: ResponseType }) => {
  const states = getAllStates();

  const { preview, handleImageChange } = useImageUploader({
    placeholder: PlusAvatar,
  });

  console.log(somedata);

  return (
    <div className="custom-flex-col w-full max-w-[968px] gap-8">
      <div className="custom-flex-col gap-4">
        <h2 className="text-brand-10 text-base font-bold">Branch Details</h2>
        <SectionSeparator />
        <div className="custom-flex-col gap-5">
          <div className="grid grid-cols-3 gap-5">
            <Input
              id="branch-title"
              label="branch title"
              placeholder="Moniya Branch"
              inputClassName="bg-white"
              defaultValue={somedata?.branch?.branch_title}
            />
            <Select
              id="state"
              isSearchable
              label="state"
              options={states}
              inputContainerClassName="bg-white"
              defaultValue={somedata?.branch?.state}
            />
            <Select
              id="local-government"
              isSearchable
              label="local government"
              options={[]}
              inputContainerClassName="bg-white"
              defaultValue={somedata?.branch?.local_government}
            />
            <Input
              id="city"
              label="city"
              placeholder="Ibadan"
              inputClassName="bg-white"
              defaultValue={somedata?.branch?.city}
            />
            <Input
              id="full-address"
              label="full address"
              placeholder="U4 Joke Plaza, Bodija ibadan"
              inputClassName="bg-white"
              defaultValue={somedata?.branch?.branch_full_address}
            />
            <Select
              id="branch-wallet"
              label="branch wallet"
              options={["yes", "no"]}
              inputContainerClassName="bg-white"
              defaultValue={somedata?.branch?.branch_wallet}
            />
          </div>
          <div className="custom-flex-col gap-2">
            <Label id="branch-description">branch description</Label>
            <TextArea
              className="bg-white"
              id="branch-description"
              defaultValue={somedata?.branch?.branch_description}
            />
          </div>
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <p className="text-black text-base font-normal">
          Upload Branch picture or choose from options.
        </p>
        <div className="flex gap-3 items-center">
          <label htmlFor="picture" className="cursor-pointer">
            <Picture
              src={somedata?.branch?.branch_image || preview}
              alt="plus"
              size={40}
              className="rounded-[4px] bg-[#D9D9D9] border border-solid border-neutral-4"
            />
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              className="hidden pointer-events-none"
              onChange={handleImageChange}
            />
          </label>
          {Array(4)
            .fill(null)
            .map((_, idx) => (
              <button type="button" key={idx}>
                <Picture
                  src={`/empty/avatar-${idx + 1}.svg`}
                  alt="avatar"
                  size={40}
                  rounded
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditBranchForm;
