"use client";
import { Fragment, useEffect, useState } from "react";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import Button from "@/components/Form/Button/button";
import Image from "next/image";
import { PlusIcon, DeleteIconOrange } from "@/public/icons/icons";
import { AuthForm } from "@/components/Auth/auth-components";
import { MAX_FILE_SIZE_MB } from "@/data";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import useFetch from "@/hooks/useFetch";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { toast } from "sonner";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  deleteAnnouncement,
  updateAnnouncement,
} from "@/app/(nav)/tasks/announcements/data";
import { useRole } from "@/hooks/roleContext";

const MAX_IMAGES = 4;

const CreateAnnouncementForm: React.FC<{
  handleSubmit: (data: any) => void;
  editMode?: boolean;
  isLoading?: boolean;
}> = ({ handleSubmit, editMode = false, isLoading }) => {
  const { company_id } = usePersonalInfoStore();
  const { role } = useRole();
  const { announcementId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: announcementData,
    silentLoading: silentLoadingAnnouncement,
    loading: loadingAnnouncement,
    error,
  } = useFetch<any>(`/announcements/${announcementId}`);
  const [branches, setBranches] = useState<
    { id: number; branch_name: string }[]
  >([]);
  const [properties, setProperties] = useState<{ id: number; title: string }[]>(
    []
  );

  const [selectedBranch, setSelectedBranch] = useState<{
    id: number | null;
    branch_name: string;
  } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<{
    id: number | null;
    title: string;
  } | null>(null);

  const {
    data: branchData,
    silentLoading,
    loading,
  } = useFetch<{ data: { id: number; branch_name: string }[] }>(`/branches`);

  useEffect(() => {
    if (branchData) {
      const branchIdName = branchData?.data.map((branch) => {
        return {
          id: branch.id,
          branch_name: branch.branch_name,
        };
      });
      setBranches(branchIdName);
    }
  }, [branchData]);

  const {
    data: propertyData,
    silentLoading: propertySilent,
    loading: propertyLoading,
  } = useFetch<{
    data: { branch: { properties: { id: number; title: string }[] } };
  }>(
    selectedBranch && selectedBranch.id ? `/branch/${selectedBranch.id}` : null
  );

  useEffect(() => {
    if (propertyData) {
      const propertyIdTitle = propertyData.data.branch.properties.map(
        (property) => {
          return {
            id: property.id,
            title: property.title,
          };
        }
      );
      setProperties(propertyIdTitle);
    }
  }, [propertyData]);

  const [imageFiles, setImageFiles] = useState<File[]>([]); // Store actual File objects
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Store Base64 for previews

  useEffect(() => {
    if (announcementData && editMode) {
      const defaultImage = announcementData?.announcement?.images?.map(
        (image: { url: string }) => image.url
      ) as string[];
      setImagePreviews(defaultImage);
    }
  }, [announcementData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    files = files.slice(0, MAX_IMAGES - imageFiles.length);
    const validFiles: File[] = [];
    const validPreviews: string[] = [];
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
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result as string);
        if (validPreviews.length + oversizeImages.length === files.length) {
          setImageFiles((prevFiles) => [...prevFiles, ...validFiles]);
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            ...validPreviews,
          ]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (oversizeImages.length > 0) {
      alert(
        `Some images were rejected due to exceeding the maximum size: ${MAX_FILE_SIZE_MB} MB`
      );
    }

    e.target.value = "";
  };

  const onFormSubmit = (formData: FormData) => {
    const title = formData.get("title");
    const description = formData.get("description");

    if (!title) {
      toast.error("You need to provide a title");
      return;
    } else if (!description) {
      toast.error("You need to provide a description");
      return;
    } else if (String(description).trim().length < 30) {
      toast.error("Description must be at least 30 characters.");
      return;
    }

    const videoLink = formData.get("video_link") as string;
    if (imageFiles.length === 0 && (!videoLink || videoLink.trim() === "")) {
      toast.error("Please upload at least one image or provide a video link.");
      return;
    }
    // Append image files to FormData
    imageFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    if (company_id) formData.append("company_id", company_id);

    // Call the parent handleSubmit with the updated FormData
    handleSubmit(formData);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const paramId = announcementId as string;

  // switch the route
  const getRoute = () => {
    switch (role) { 
      case "account":
        return "/accountant/tasks/announcements";
      case "manager":
        return "/manager/tasks/announcements";
      default:
        return "/tasks/announcements";
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (company_id) formData.append("company_id", company_id);
    formData.append("_method", "PATCH");
    const description = formData.get("description");

    const title = formData.get("title");

    // if (!title) {
    //   toast.error("You need to provide a title");
    //   return;
    // } else if (!description) {
    if (!description) {
      toast.error("You need to provide a description");
      return;
    } else if (String(description).trim().length < 40) {
      toast.error("Description must be at least 30 characters.");
      return;
    }

    const videoLink = formData.get("video_link") as string;
    if (imagePreviews.length === 0 && (!videoLink || videoLink.trim() === "")) {
      toast.error("Please upload at least one image or provide a video link.");
      return;
    }

    imageFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      setIsSubmitting(true);
      const success = await updateAnnouncement(formData, paramId);
      if (success) {
        toast.success("Announcement updated");
        router.push(getRoute());
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteAnnouncement(paramId);
      if (success) {
        toast.success("Announcement deleted");
        router.push(getRoute());
      }
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (editMode && branchData) {
      const branchIdName = branchData?.data.map((branch) => ({
        id: branch.id,
        branch_name: branch.branch_name,
      }));
      setBranches(branchIdName);

      // Set selected branch from announcement data if not already set
      if (announcementData?.announcement?.branch_id && !selectedBranch) {
        const foundBranch = branchIdName.find(
          (b) => b.id === announcementData.announcement.branch_id
        );
        if (foundBranch) setSelectedBranch(foundBranch);
      }
    }
  }, [editMode, branchData, announcementData]);

  useEffect(() => {
    if (editMode && propertyData) {
      const propertyIdTitle = propertyData.data.branch.properties.map(
        (property) => ({
          id: property.id,
          title: property.title,
        })
      );
      setProperties(propertyIdTitle);

      // Set selected property from announcement data if not already set
      if (announcementData?.announcement?.property_id && !selectedProperty) {
        const foundProperty = propertyIdTitle.find(
          (p) => p.id === announcementData.announcement.property_id
        );
        if (foundProperty) setSelectedProperty(foundProperty);
      }
    }
  }, [editMode, propertyData, announcementData]);

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={editMode ? handleUpdate : onFormSubmit}
      setValidationErrors={() => {}}
    >
      <div className="flex flex-col gap-y-5 gap-x-[40px] lg:flex-row lg:items-start pb-[200px]">
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 lg:w-[63%]">
          {
            <Fragment>
              <Select
                id="branch_id"
                label="Branch"
                className="branch-selection-dropdown"
                disabled={silentLoading || loading}
                placeholder={
                  loading ? "Please wait..." : "Send to all Branches"
                }
                options={branches.map((branch) => {
                  return {
                    value: branch.id,
                    label: branch.branch_name,
                  };
                })}
                value={
                  selectedBranch && selectedBranch.id !== null
                    ? {
                        value: selectedBranch.id.toString(),
                        label: selectedBranch.branch_name,
                      }
                    : ""
                }
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const branch = branches.find(
                      (b) => b.id.toString() === selectedOption
                    );
                    if (branch) {
                      setSelectedBranch(branch);
                    }
                  } else {
                    setSelectedBranch(null);
                    setSelectedProperty(null);
                  }
                }}
                inputContainerClassName="bg-white"
              />
              <Select
                id="property_id"
                label="Property"
                className="property-selection-dropdown"
                disabled={!selectedBranch || propertySilent}
                placeholder={
                  propertyLoading ? "Please wait..." : "Send to all Properties"
                }
                options={properties.map((property) => {
                  return {
                    value: property.id.toString(),
                    label: property.title,
                  };
                })}
                value={
                  selectedProperty && selectedProperty.id !== null
                    ? {
                        value: selectedProperty.id.toString(),
                        label: selectedProperty.title,
                      }
                    : ""
                }
                onChange={(selectedValue) => {
                  if (selectedValue) {
                    const property = properties.find(
                      (p) => p.id.toString() === selectedValue
                    );
                    if (property) {
                      setSelectedProperty(property);
                    }
                  } else {
                    setSelectedProperty(null);
                  }
                }}
                inputContainerClassName="bg-white"
              />
            </Fragment>
          }
          <Input
            id="title"
            label="Title"
            placeholder="Add title"
            className="title-input md:col-span-2"
            inputClassName="bg-white"
            defaultValue={editMode ? announcementData?.announcement?.title : ""}
          />
          <TextArea
            id="description"
            className="description-textarea md:col-span-2"
            label="Description"
            defaultValue={
              editMode ? announcementData?.announcement?.description : ""
            }
          />
        </div>
        <div className="media-upload-section lg:flex-1 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {imagePreviews?.length > 0 &&
              imagePreviews?.map((src, index) => (
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
                      setImageFiles((prevFiles) =>
                        prevFiles.filter((_, i) => i !== index)
                      );
                      setImagePreviews((prevPreviews) =>
                        prevPreviews.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute top-1 right-1 z-[2]"
                  >
                    <DeleteIconOrange size={20} />
                  </button>
                </div>
              ))}
            {imagePreviews?.length < MAX_IMAGES && (
              <label
                htmlFor="upload"
                className="px-4 w-full h-[110px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262] dark:text-darkText-1"
              >
                <PlusIcon />
                <span className="text-black dark:text-darkText-1 text-base font-normal mt-2 text-center">
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
            defaultValue={
              editMode ? announcementData?.announcement?.video_link : ""
            }
          />
        </div>
      </div>
      <FixedFooter className="flex items-center justify-end gap-4">
        {editMode && (
          <Button
            disabled={isDeleting}
            onClick={handleDeleteAnnouncement}
            variant="light_red"
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
          >
            {isDeleting ? "Please wait..." : "Delete Announcement"}
          </Button>
        )}
        {editMode ? (
          <Button
            disabled={isSubmitting}
            type="submit"
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
          >
            {isSubmitting ? "Please wait..." : "Update Announcement"}
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            type="submit"
            size="custom"
            className="create-button py-2 px-8 font-bold text-sm lg:text-base"
          >
            {isLoading ? "Please wait..." : "Create Announcement"}
          </Button>
        )}
      </FixedFooter>
    </AuthForm>
  );
};

export default CreateAnnouncementForm;
