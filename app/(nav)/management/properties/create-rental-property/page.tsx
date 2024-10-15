"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { ChevronLeft } from "@/public/icons/icons";

import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import CreateRentalPropertyForm from "@/components/Management/Properties/create-property-form";
import { addProperty } from "./data";
import { useAuthStore } from "@/store/authstrore";
import { formDataToString } from "@/components/Auth/auth-components";

const CreateProperty = () => {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.access_token);

  const handleSubmit = async (data: FormData) => {
    // Add additional fields to the FormData
    // data.append("annual_rent", "5000"); // Replace "5000" with the actual value
    // data.append("service_charge", "1000"); // Replace "1000" with the actual value
    // data.append("legal", "300"); // Replace with actual value
    // data.append("other_charges", "200"); // Replace with actual value

    // console.log(formDataToString(data));

    // const isSuccess = await addProperty(data, accessToken);
    // Post data to API
    router.push("/management/properties/create-rental-property/add-unit");
  };

  return (
    <Fragment>
      {/* Back Button & Page Title */}
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          aria-label="Go Back"
          onClick={() => router.back()}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-black font-bold text-lg lg:text-xl">
          Create Rental Property
        </h1>
      </div>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={27}
        className="mb-[52px]"
      />
      <CreateRentalPropertyForm handleSubmit={handleSubmit} formType="rental" />
    </Fragment>
  );
};

export default CreateProperty;
