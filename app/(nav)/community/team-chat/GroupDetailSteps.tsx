"use client";

import React from "react";
import { PlusIcon } from "@/public/icons/icons";
import Image from "next/image";
import { AuthForm } from "@/components/Auth/auth-components";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import { useCreateGroup } from "@/contexts/createGroup";
import { ChevronLeftIcon } from "lucide-react";

interface GroupDetailsStepProps {
  onBack: () => void;
  onClose: () => void;
}

const GroupDetailsStep: React.FC<GroupDetailsStepProps> = ({
  onBack,
  onClose,
}) => {
  const {
    uploadedImage,
    fileInputRef,
    isCreating,
    handleImageUpload,
    handleSubmitCreateGroup,
  } = useCreateGroup();

  return (
    <div className="flex flex-col gap-4 py-3 bg-white dark:bg-darkText-primary">
      <AuthForm returnType="form-data" onFormSubmit={handleSubmitCreateGroup}>
        <div className="flex flex-col gap-1">
          <p className="dark:text-white">Group Name</p>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Group Name"
          />
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <p className="dark:text-white">Group Description</p>
          <TextArea
            id="description"
            placeholder="Group Description"
          />
        </div>
        <div className="flex flex-col items-start gap-2 mt-2">
          <p className="text-text-disabled text-sm">
            Formats: .jpg, .gif, .png (5MB max)
          </p>
          {uploadedImage ? (
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                id="picture"
                name="picture"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Image
                src={uploadedImage}
                alt="Uploaded Group"
                width={85}
                height={85}
                className="rounded-md object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              className="bg-[#F4F4F9] dark:bg-darkText-primary border border-dashed border-text-label text-sm text-text-label w-2/4 h-[85px] rounded-md flex flex-col items-center justify-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                id="picture"
                name="picture"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <PlusIcon />
              Add Image
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-6">
          {/* <Button
            type="button"
            variant="border"
            size="base_medium"
            className="px-8 py-2 w-full"
            // className="bg-text-disabled text-sm text-white w-1/2 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </Button> */}
          <Button
            type="submit"
            disabled={isCreating}
            variant="default"
            size="base_medium"
            className="px-8 py-2 ml-auto"
            // className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </AuthForm>
    </div>
  );
};

export default GroupDetailsStep;
