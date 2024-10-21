"use client";
import { Fragment, useState } from "react";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import { empty } from "@/app/config";
import Button from "@/components/Form/Button/button";
import Image from "next/image";
import { PlusIcon, DeleteIconOrange } from "@/public/icons/icons";
import { AuthForm } from "@/components/Auth/auth-components";
import { MAX_FILE_SIZE_MB } from "@/data";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const MAX_IMAGES = 4;
const CreateAnnouncementForm: React.FC<{
  handleSubmit: (data: any) => void;
  editMode?: boolean;
}> = ({ handleSubmit, editMode = false }) => {
  const [images, setImages] = useState<string[]>([]);

  // HANDLE IMAGES UPLOAD
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    files = files.slice(0, MAX_IMAGES - images.length);
    const validImages: string[] = [];
    const oversizeImages: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Upload only image files.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        oversizeImages.push(file.name);
        continue;
      }
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          validImages.push(reader.result as string);
          if (validImages.length + oversizeImages.length === files.length) {
            setImages((prevImages) => [...prevImages, ...validImages]);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("There was an error processing your image. Please try again.");
      }
    }

    if (oversizeImages.length > 0) {
      alert(
        `Some images were rejected due to exceeding the maximum size: ${MAX_FILE_SIZE_MB} MB`
      );
    }

    e.target.value = "";
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleSubmit}
      setValidationErrors={() => {}}
    >
      <div className="flex flex-col gap-y-5 gap-x-[40px] lg:flex-row lg:items-start pb-[200px]">
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
            className="md:col-span-2"
            inputClassName="bg-white"
          />
          <TextArea id="content" className="md:col-span-2" />
        </div>
        <div className="lg:flex-1 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {images.length > 0 &&
              images.map((src, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg w-full h-[110px]"
                >
                  <Image
                    src={src}
                    alt={`Uploaded ${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Remove Image"
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 z-[2]"
                  >
                    <DeleteIconOrange size={20} />
                  </button>
                </div>
              ))}
            {images.length < MAX_IMAGES && (
              <label
                htmlFor="upload"
                className="px-4 w-full h-[110px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
              >
                <PlusIcon />
                <span className="text-black text-base font-normal mt-2 text-center">
                  Add Photo/Video
                </span>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <Input
            id="video_link"
            label="Video Link"
            type="url"
            placeholder="https://www.youtube.com/video"
            inputClassName="bg-white"
          />
        </div>
      </div>
      <FixedFooter className="flex items-center justify-end gap-4">
        {editMode && (
          <Button
            variant="light_red"
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
          >
            Delete Announcement
          </Button>
        )}
        <Button
          type="submit"
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
        >
          {editMode ? "Update Announcement" : "Create Announcement"}
        </Button>
      </FixedFooter>
    </AuthForm>
  );
};

export default CreateAnnouncementForm;
