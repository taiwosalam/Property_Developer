import { useState } from "react";
import Image from "next/image";
import Input from "@/components/Form/Input/input";
import { DeleteIconOrange, PlusIcon } from "@/public/icons/icons";

const AddPhotoAndVideo = () => {
  // HANDLE IMAGES UPLOAD
  const MAX_FILE_SIZE_MB = 2;
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

export default AddPhotoAndVideo;
