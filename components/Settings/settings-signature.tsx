"use client";

import React, { useEffect, useState } from "react";

// Images
import { Check } from "lucide-react";
import DangerIcon from "@/public/icons/danger.svg";
import ImageBlue from "@/public/icons/image-blue.svg";
import SignatureImage from "@/public/accounting/signature.svg";

// Imports
import { industryOptions, titles } from "@/data";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Select from "@/components/Form/Select/select";
import { useImageUploader } from "@/hooks/useImageUploader";
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import { createSignatureProfiles, FormState } from "@/app/(nav)/settings/security/data";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { SignaturePageData, transformSignature } from "@/app/(nav)/settings/data";
import { empty } from "@/app/config";


const SettingsSignature = () => {
  const [state, setState] = useState<SignaturePageData[]>([]);
  const { preview, inputFileRef, handleImageChange } = useImageUploader();
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<any>("/company-signatures");
  useRefetchOnEvent("refetchSignatures", () => refetch({ silent: true }));

  useEffect(() => {
    // Assuming apiData is defined somewhere in your component
    if (apiData) {
      const transformedData = transformSignature(apiData);
      setState(transformedData);

      // Update inputFields based on new state
      setInputFields(transformedData.length > 0 ? transformedData.map(signature => ({
        id: signature.id,
        signature: signature.signature_image || empty,
        signatureFile: new File([], ""), // Create File only on the client
        name: signature.name,
        title: signature.title,
        professional_title: signature.professional_title
      })) : [{
        id: Date.now(),
        signature: empty,
        signatureFile: new File([], ""),
      }]);
    }
  }, [apiData]);


  const [inputFields, setInputFields] = useState(() => {
    if (typeof window !== "undefined") {
      // Check if state is empty and use default values if so
      if (state.length > 0) {
        return state.map(signature => ({
          id: Date.now(),
          signature: signature.signature_image,
          signatureFile: new File([], ""), // Create File only on the client
          name: signature.name,
          title: signature.title,
          professional_title: signature.professional_title
        }));
      } else {
        return [
          {
            id: Date.now(),
            signature: empty,
            signatureFile: new File([], ""),
          },
        ];
      }
    }
    return [];
  });

  // console.log("INput fields", inputFields)


  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);
  const changeImage = () => {
    inputFileRef.current?.click();
  };

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      { id: Date.now(), signature: empty, signatureFile: new File([], "") },
    ]);
  };

  const removeInputField = (id: number) => {
    const updatedFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedFields);
    // console.log("Input Fields after removing:", updatedFields);
  };

  const changeSignatureImage = (index: number) => {
    document.getElementById(`signature_input_${index}`)?.click();
  };

  const handleSignatureChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof window === "undefined" || !e.target.files || !e.target.files[0]) {
        return;
      }
      if (e.target.files && e.target.files[0]) {
        const newSignature = URL.createObjectURL(e.target.files[0]);
        const newFile = e.target.files[0];
        setInputFields(
          inputFields.map((inputField) =>
            inputField.id === inputFields[index].id
              ? { ...inputField, signature: newSignature, signatureFile: newFile }
              : inputField
          )
        );
      }
    };

  const hanleCreateSignature = async (data: FormData) => {
    const formData = new FormData();

    inputFields.forEach((field, index) => {
      formData.append(`name[${index}]`, data.get(`fullname_${index}`) as string);
      formData.append(`title[${index}]`, data.get(`personal_title_qualification_${index}`) as string);
      formData.append(`professional_title[${index}]`, data.get(`real_estate_title_${index}`) as string);
      // formData.append(`signature[${index}]`, field.signatureFile); // Binary file

      if (typeof field.signature === 'string') {
        formData.append(`signature[${index}]`, field.signature); // Append the string directly
      } else {
        formData.append(`signature[${index}]`, field.signatureFile); // Append the file
      }
    });

    console.log("Payload:", Object.fromEntries(formData));

    try {
      setReqLoading(true);
      const res = await createSignatureProfiles(formData);
      if (res) {
        toast.success("Signature created successfully");
        setNext(true);
        window.dispatchEvent(new Event("refetchSignatures"));
      }
    } catch (error) {
      toast.error("Error creating signature");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <SettingsSection title="Authorized Signature">
      <AuthForm onFormSubmit={hanleCreateSignature} returnType="form-data">
        <div className="custom-flex-col gap-8">
          <div className="custom-flex-col gap-6">
            <SettingsSectionTitle
              title=""
              desc="This signature is affixed to every document requiring authorization. Please sign on a plain white paper and take a photo for uploading. If possible, remove the background picture of the signature before uploading for a cleaner appearance."
            />
            <div className="custom-flex-col gap-[18px]">
              <div className="flex flex-col gap-5">
                {inputFields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <div className="relative max-w-[100px] rounded-lg overflow-hidden bg-[#F7F7F7] group cursor-pointer">
                      <Picture
                        size={100}
                        fit="contain"
                        src={field.signature}
                        alt="official signature"
                      />
                      <div
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}
                        onClick={() => changeSignatureImage(index)}
                        className="absolute inset-0 flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 duration-300"
                      >
                        <Picture src={ImageBlue} alt="image icon" size={20} />
                        <p
                          className="text-brand-9 text-xs font-normal"
                          // onClick={() => changeSignatureImage(index)}
                        >
                          Change Image
                        </p>
                      </div>
                      <input
                        type="file"
                        id={`signature_input_${index}`}
                        name={`signature_${index}`}
                        accept="image/*"
                        onChange={handleSignatureChange(index)}
                        className="hidden"
                        ref={React.createRef()}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 justify-start md:justify-end md:items-end items-start">
                      <div className="flex-1">
                        <Select
                          id={`personal_title_qualification_${index}`}
                          options={titles}
                          defaultValue={state[index]?.title}
                          label="personal title / qualification"
                          inputContainerClassName="w-full bg-neutral-2"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id={`fullname_${index}`}
                          label="full name"
                          placeholder="Write Here"
                          className="w-full"
                          defaultValue={state[index]?.name}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <Select
                          id={`real_estate_title_${index}`}
                          options={industryOptions}
                          defaultValue={state[index]?.professional_title}
                          label="real estate title"
                          inputContainerClassName="w-full bg-neutral-2"
                        />
                        {index !== 0 && (
                          <button
                            className="bg-brand-9 min-w-[50px] text-white text-xs font-normal py-2 px-3 rounded-lg max-h-[40px]"
                            onClick={() => removeInputField(field.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                <div className="flex items-end">
                  <button
                    className="text-xs font-normal py-2 px-3 w-full sm:w-auto text-brand-9 bg-white"
                    onClick={addInputField}
                    type="button"
                  >
                    Add More
                  </button>
                </div>
              </div>
            </div>
          </div>
          <SettingsUpdateButton
            submit
            action={hanleCreateSignature as any}
            loading={reqLoading}
            next={next}
          />
        </div>
      </AuthForm>
    </SettingsSection>
  )
}

export default SettingsSignature