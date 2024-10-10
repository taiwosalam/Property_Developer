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

const CreateAnnouncementForm: React.FC<{
  handleSubmit: (data: any) => void;
  editMode?: boolean;
}> = ({ handleSubmit, editMode = false }) => {
  const [images, setImages] = useState<File[]>([]);

  // HANDLE IMAGES UPLOAD
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newImages = selectedFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        // 2 MB in bytes
        alert(`${file.name} exceeds the 2MB size limit.`);
        return false;
      }
      return true;
    });

    const finalImages = [...images, ...newImages].slice(0, 4); // Limit to 4 images
    setImages(finalImages);
    console.log(images)
    e.target.value = "";
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleSubmit}
      setValidationErrors={() => { }}
    >
      <div className="flex flex-col gap-y-5 gap-x-[4%] lg:flex-row lg:items-start pb-[200px]">
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
          <TextArea id="content" className="col-span-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 flex-1">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg w-full h-[110px]"
              >
                <Image
                  src={URL.createObjectURL(image)}
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
            ))
          ) : (
            <div className="relative overflow-hidden rounded-lg w-full h-[110px]">
              <Image src={empty} alt="empty" fill className="object-cover" />
            </div>
          )}
          <label
            htmlFor="upload"
            className="px-4 w-full h-[110px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
          >
            <PlusIcon />
            <span className="text-black text-base font-normal mt-2">
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
        </div>
      </div>
      <div
        className="sticky z-[3] bottom-0 right-0 w-full py-5 px-[25px] lg:px-[60px] bg-white flex items-center justify-end gap-4"
        style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
      >
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
      </div>
    </AuthForm>
  );
};

export default CreateAnnouncementForm;
