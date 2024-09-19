import { PlusIcon, DeleteIconOrange } from "@/public/icons/icons";
import Image from "next/image";
import { useUnitForm } from "./unit-form-context";
import clsx from "clsx";

const MAX_FILE_SIZE_MB = 2; // Maximum file size in MB

const UnitPictures = () => {
  const { images, addImages, removeImage, isEditing } = useUnitForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const validImages: File[] = [];
      const invalidFiles: File[] = [];

      filesArray.forEach((file) => {
        if (file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) {
          validImages.push(file);
        } else {
          invalidFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        alert(
          `Some files exceed the ${MAX_FILE_SIZE_MB} MB size limit and will not be uploaded.`
        );
      }

      if (validImages.length > 0) {
        addImages(validImages);
      }
    }
    e.target.value = ""; // Reset input value to allow re-uploading the same file
  };

  return (
    <div className={clsx(isEditing && "!mt-0")}>
      <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
        Unit Pictures
      </h4>
      <hr
        className={clsx(
          "my-4 border-none bg-borders-dark",
          isEditing ? "h-[1px]" : "h-[2px]"
        )}
      />
      <p className="text-text-secondary mb-5">
        Unit pictures are what will be shown to potential clients on the mobile
        app and your default website (maximum of 14 images).
      </p>
      <div className="flex gap-4 overflow-x-auto">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative w-[285px] h-[155px] rounded-lg overflow-hidden border border-gray-300"
          >
            <Image
              src={URL.createObjectURL(image)}
              alt={`Property Image ${index + 1}`}
              className="object-cover object-center w-full h-full"
              fill
            />
            <button
              type="button"
              aria-label="Remove Image"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1"
            >
              <DeleteIconOrange size={20} />
            </button>
          </div>
        ))}
        {images.length < 14 && (
          <label
            htmlFor="upload"
            className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
          >
            <PlusIcon />
            <span className="text-black text-base font-normal mt-2">
              Add Pictures
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
    </div>
  );
};

export default UnitPictures;
