"use client";

import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";
import Select from "@/components/Form/Select/select";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { useEffect, useState } from "react";

export const ManageArticleSecondSection = ({
  data,
  loading,
  setImageFiles,
  retainMedia,
  setRetainMedia,
}: {
  data: any;
  loading: boolean;
  setImageFiles: (files: File[]) => void;
  retainMedia: string[];
  setRetainMedia: (media: string[]) => void;
}) => {
  const stateOptions = getAllStates();
  const [address, setAddress] = useState({
    state: "",
    lga: "",
    city: "",
  });

  // Sync address state with data when data changes
  useEffect(() => {
    if (data) {
      setAddress({
        state: data.state || "",
        lga: data.lga || "",
        city: "",
      });
    }
  }, [data]);

  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { lga: "", city: "" }),
      ...(key === "lga" && { city: "" }),
    }));
  };

  if (loading) return <SecondSectionLoader />;
  return (
    <div className="z-[1000] bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
      <AddPhotoAndVideo
        editing={true}
        data={data}
        onFilesChange={(files) => setImageFiles(files)}
        retainMedia={retainMedia}
        setRetainMedia={setRetainMedia}
      />

      <Select
        options={stateOptions}
        id="state"
        label="state"
        value={address.state}
        onChange={(value) => handleAddressChange("state", value)}
        required
        // defaultValue={data.state}
      />

      <Select
        options={getLocalGovernments(address.state)}
        id="lga"
        label="local government"
        onChange={(value) => handleAddressChange("lga", value)}
        value={address.lga}
        required
        // defaultValue={data.lga}
      />
    </div>
  );
};

export const SecondSectionLoader = () => {
  return (
    <div className="bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
      {/* Skeleton for AddPhotoAndVideo */}
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>

      {/* Skeleton for StateAndLocalGovt */}
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};
