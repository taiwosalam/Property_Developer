import { PlusIcon } from "@/public/icons/icons";

const UnitPictures = () => {
  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Unit Pictures
      </h4>
      <hr className="my-4" />
      <p className="text-text-secondary mb-5">
        Unit pictures are what will be shown to potential clients on the mobile
        app and your default website (maximum of 14 images).
      </p>
      <label
        htmlFor="upload"
        className="w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
      >
        <PlusIcon />
        <span className="text-text-secondary text-base font-normal">
          Add Pictures
        </span>
        <input
          id="upload"
          type="file"
          accept="image/*"
          multiple
          // onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default UnitPictures;
