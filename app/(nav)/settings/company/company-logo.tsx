import { useContext, useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { DeleteIconOrange, UploadImageIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { SectionHeading } from "@/components/Section/section-components";
import Button from "@/components/Form/Button/button";
import { deleteCompanyLogo } from "./data";
import { usePersonalInfoStore } from "@/store/personal-info-store";

interface CompanyLogoProps {
  lightLogo?: string | StaticImageData;
  darkLogo?: string | StaticImageData;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ lightLogo, darkLogo }) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const inputFileRefs = {
    light: useRef<HTMLInputElement>(null),
    dark: useRef<HTMLInputElement>(null),
  };

  const { company_id } = usePersonalInfoStore();

  const [lightPreview, setLightPreview] = useState<
    string | StaticImageData | null
  >(lightLogo || null);
  const [darkPreview, setDarkPreview] = useState<
    string | StaticImageData | null
  >(darkLogo || null);
  const [deleteLogoLoading, setDeleteLogoLoading] = useState<boolean>(false);

  useEffect(() => {
    setLightPreview(lightLogo || null);
    setDarkPreview(darkLogo || null);
  }, [lightLogo, darkLogo]);

  // Handle file input click
  const handleButtonClick = (mode: "light" | "dark") => {
    const inputFileRef = inputFileRefs[mode];
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // Handle image upload and preview
  const handleFileChange =
    (mode: "light" | "dark") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          if (mode === "light") {
            setLightPreview(previewUrl);
          } else {
            setDarkPreview(previewUrl);
          }
        };
        reader.readAsDataURL(file);
      }
      handleInputChange(); // Notify flow progress change
    };

  // Handle deleting the selected image
  const handleDeleteImage = (mode: "light" | "dark") => {
    if (mode === "light") {
      setLightPreview(null);
    } else {
      setDarkPreview(null);
    }
    handleInputChange(); // Notify flow progress change
  };

  const handleDeleteCompanyLogo = async (mode: "light" | "dark") => {
    let payload;
    if (mode === "light") {
      payload = { remove_company_logo: true };
    } else {
      payload = { remove_dark_logo: true };
    }
    try {
      setDeleteLogoLoading(true);
      if (company_id) {
        const res = await deleteCompanyLogo(payload, company_id);
        if (res) {
          setDarkPreview(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLogoLoading(false);
    }
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="Company Logo">
        Ensure that your company logo has a white background, with a maximum
        size of 2MB. The picture must be between 250 to 600 pixels wide, or
        ideally 160px x 450px.
      </SectionHeading>

      <div className="flex gap-4 flex-wrap">
        {(["light", "dark"] as const).map((mode) => (
          <div key={mode}>
            <h3 className="text-md font-medium mb-4">
              {mode === "light" ? "Light Mode Logo" : "Dark Mode Logo"}
            </h3>
            <div className="flex gap-2">
              <input
                name={`${mode}_company_logo`}
                type="file"
                accept="image/*"
                ref={inputFileRefs[mode]}
                onChange={handleFileChange(mode)}
                className="hidden"
              />
              {(mode === "light" ? lightPreview : darkPreview) ? (
                <div className="w-[375px] h-[150px] relative rounded-xl flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(mode)}
                    className="absolute top-[-15px] right-[-25px] z-10"
                    aria-label={`Delete ${mode} logo`}
                  >
                    <DeleteIconOrange />
                  </button>
                  <div className="relative w-full h-full rounded-md overflow-hidden">
                    <Image
                      src={
                        mode === "light"
                          ? lightPreview || lightLogo || ""
                          : darkPreview || darkLogo || ""
                      }
                      alt={`${mode} Company Logo`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md w-[375px] h-[150px] object-contain"
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleButtonClick(mode)}
                  className="w-[375px] h-[150px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
                >
                  <UploadImageIcon />
                  <span className="text-text-secondary text-sm font-normal mt-2">
                    Upload {mode} logo here
                  </span>
                </button>
              )}
              {(mode === "light" ? lightPreview : darkPreview) && (
                <div className="flex items-end">
                  <Button
                    className={`${
                      mode === "light"
                        ? "invisible"
                        : "visible bg-red-300/30 text-red-600"
                    }`}
                    variant="change"
                    size="sm"
                    onClick={() => handleDeleteCompanyLogo("dark")}
                  >
                    {deleteLogoLoading ? "Please wait..." : "Delete logo"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyLogo;
