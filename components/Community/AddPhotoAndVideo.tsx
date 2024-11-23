"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Input from "@/components/Form/Input/input";
import { DeleteIconOrange, PlusIcon } from "@/public/icons/icons";

const AddPhotoAndVideo = ({
  editing,
  data,
  onFilesChange,
  retainMedia,
  setRetainMedia
}: {
  editing?: boolean;
  data?: any;
  onFilesChange?: (files: File[], videoLink?: string) => void;
  retainMedia?: string[];
  setRetainMedia?: (media: string[]) => void;
}) => {
  const MAX_FILE_SIZE_MB = 2;
  const MAX_IMAGES = 4;

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState("");

  useEffect(() => {
    if (editing && data) {
      if (data.media) {
        const paths = data.media.map((item: { path: string }) => item.path);
        const retainIds = data.media.map((item: { id: string }) => item.id);
        setImagePreviews(paths);
        setRetainMedia?.(retainIds);
      }
      if (data.video_link) {
        setVideoLink(data.video_link);
      }
    }
  }, [data, editing]);

  // console.log(imagePreviews);
  console.log('retainMedia', retainMedia);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    files = files.slice(0, MAX_IMAGES - imagePreviews.length);

    const validFiles: File[] = [];
    const oversizeImages: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Upload only image files.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        oversizeImages.push(file.name);
        return;
      }

      validFiles.push(file);
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => {
      const updatedFiles = [...prev, ...validFiles];
      onFilesChange?.(updatedFiles, videoLink); // Notify parent component
      return updatedFiles;
    });

    if (oversizeImages.length > 0) {
      alert(
        `Some images were rejected due to exceeding the maximum size: ${MAX_FILE_SIZE_MB} MB`
      );
    }

    e.target.value = "";
  };


  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    onFilesChange?.(
      imageFiles.filter((_, i) => i !== index),
      videoLink
    ); // Update parent

    const updatedRetainMedia = retainMedia?.filter((_, i) => i !== index) || [];
    setRetainMedia?.(updatedRetainMedia);
    console.log("Updated retainMedia:", updatedRetainMedia); // Log updated retainMedia
  };

  return (
    <div className="lg:flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {imagePreviews.map((src, index) => (
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
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 z-[2]"
            >
              <DeleteIconOrange size={20} />
            </button>
          </div>
        ))}
        {imagePreviews.length < MAX_IMAGES && (
          <label
            htmlFor="picture"
            className="px-4 w-full h-[110px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262] dark:text-darkText-1"
          >
            <PlusIcon />
            <span className="text-black dark:text-darkText-1 text-base font-normal mt-2 text-center">
              Add Photo
            </span>
            <input
              id="picture"
              name="pictures"
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
        value={videoLink}
        onChange={(data) => setVideoLink(data)}
      />
    </div>
  );
};

export default AddPhotoAndVideo;
