"use client";
import { Fragment } from "react";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import { empty } from "@/app/config";
import Button from "@/components/Form/Button/button";
import Image from "next/image";
import { PlusIcon, DeleteIconOrange } from "@/public/icons/icons";

const CreateAnnouncementForm: React.FC<{
  handleSubmit: (data: any) => void;
  editMode?: boolean;
}> = ({ handleSubmit, editMode = false }) => {
  return (
    <form
      className="flex flex-col gap-y-5 gap-x-[4%] lg:flex-row lg:items-start pb-[80px]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 lg:w-[63%]">
        {!editMode && (
          <Fragment>
            <Select
              id="branch"
              label="Branch"
              placeholder="Send to all Branches"
              options={[]}
              inputContainerClassName="bg-white"
            />
            <Select
              id="property"
              label="Property"
              placeholder="Send to all Properties"
              options={[]}
              inputContainerClassName="bg-white"
            />
          </Fragment>
        )}
        <Input
          id="title"
          label="Title"
          placeholder="Add title"
          className="col-span-2"
          inputClassName="bg-white"
        />
        <TextArea id="" className="col-span-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 flex-1">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg w-full h-[110px]"
            >
              <Image src={empty} alt="empty" fill className="object-cover" />
              <button
                type="button"
                aria-label="Remove Image"
                onClick={() => {}} // Delete Image
                className="absolute top-1 right-1 z-[2]"
              >
                <DeleteIconOrange size={20} />
              </button>
            </div>
          ))}

        <label
          // htmlFor="upload"
          className="px-4 w-full h-[110px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
        >
          <PlusIcon />
          <span className="text-black text-base font-normal mt-2">
            Add Photo/Video
          </span>
          {/* <input
              id="upload"
              type="file"
              accept="image/*"
              multiple
            //   onChange={handleFileChange}
              className="hidden"
            /> */}
        </label>
      </div>
      <div
        className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-4"
        style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
      >
        {editMode && (
          <Button variant="light_red" size="16_bold" className="py-2 px-8">
            Delete Announcement
          </Button>
        )}
        <Button type="submit" size="16_bold" className="py-2 px-8">
          {editMode ? "Update Announcement" : "Create Announcement"}
        </Button>
      </div>
    </form>
  );
};

export default CreateAnnouncementForm;
