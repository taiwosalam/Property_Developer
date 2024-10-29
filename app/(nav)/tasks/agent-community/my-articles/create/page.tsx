"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FirstSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import Image from "next/image";
import { MAX_FILE_SIZE_MB } from "@/data";
import { DeleteIconOrange, PlusIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";

const CreateArticle = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 mb-1">
          <button
            type="button"
            aria-label="Go Back"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
            Create Article
          </h1>
        </div>
      </div>

      <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
        <div className="first flex flex-col w-full lg:w-[60%]">
          <FirstSection inputValue="" showTextAreaPlaceholder={true} />
        </div>

        <div className="second flex flex-col w-full lg:w-[40%]">
          <SecondSection />
        </div>
      </div>
    </>
  );
};

export default CreateArticle;

const SecondSection = () => {
  return (
    <div className="bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
      <AddPhotoAndVideo />
      <StateAndLocalGovt />
    </div>
  );
};

export const AddPhotoAndVideo = () => {
  // HANDLE IMAGES UPLOAD
  const [images, setImages] = useState<string[]>([]);
  const MAX_IMAGES = 4;
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
            className="px-4 w-full h-[110px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262] dark:text-darkText-1"
          >
            <PlusIcon />
            <span className="text-black dark:text-darkText-1 text-base font-normal mt-2 text-center">
              Add Photo
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
  );
};
