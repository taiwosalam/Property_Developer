"use client";

import React, { useCallback, useEffect, useState } from "react";

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
import SignaturePad from "signature_pad";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import Button from "../Form/Button/button";
import SignatureModal from "../Management/Properties/signature";

const SettingsSignature = () => {
  const [state, setState] = useState<SignaturePageData[]>([]);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null); // SignaturePad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      setInputFields(transformedData?.length > 0 ? transformedData?.map(signature => ({
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

  console.log("INput fields", state)

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


  // Initialize signature pad after component mount
  useEffect(() => {
    if (canvasRef.current) {
      setSignaturePad(new SignaturePad(canvasRef.current)); // Initialize SignaturePad
    }
  }, []);


  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);

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

  const handleCreateSignature = (imageBase64: string, index: number, imageFile?: File) => {
    setInputFields(prevState =>
      prevState.map((field, idx) =>
        idx === index
          ? { ...field, signature: imageBase64, signatureFile: imageFile || field.signatureFile }
          : field
      )
    );
  };

  const handleSignatureChange = (index: number) => (dataURL: string) => {
    setInputFields(prevState =>
      prevState.map((field) =>
        field.id === inputFields[index].id
          ? { ...field, signature: dataURL }
          : field
      )
    );
  };


  const hanleCreateSignature = async (data: FormData) => {
    const formData = new FormData();

    inputFields.forEach((field, index) => {
      formData.append(`signatures[${index}][name]`, data.get(`fullname_${index}`) as string || "");
      formData.append(`signatures[${index}][title]`, data.get(`personal_title_qualification_${index}`) as string || "");
      formData.append(`signatures[${index}][professional_title]`, data.get(`real_estate_title_${index}`) as string || "");
      // formData.append(`signatures[${index}][signature]`, field.signatureFile || ""); // Binary file
      // Check if the file size is greater than 0
      if (field.signatureFile && field.signatureFile.size > 0) {
        formData.append(`signatures[${index}][signature]`, field.signatureFile); // Use the file
      } else if (field.signature) {
        formData.append(`signatures[${index}][signature]`, field.signature); // Fallback to string
      } else {
        formData.append(`signatures[${index}][signature]`, ""); // Fallback to empty string
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
              desc="This signature will be used for all documents requiring authorization. Click the 'Add Signature' button to draw your signature, or select 'Upload Signature' to add a scanned or digital version of your handwritten signature."
            />
            <div className="custom-flex-col gap-[18px]">
              <div className="flex flex-col gap-5">
                {inputFields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <div className="flex rounded-lg items-center overflow-hidden gap-2 cursor-pointer">
                      <Picture
                        size={100}
                        className="max-w-[100px] max-h-[120px]"
                        fit="contain"
                        src={field.signature}
                        alt="official signature"
                      />
                      <Modal>
                        <ModalTrigger asChild>
                          <button className="self-end bg-brand-9 text-white text-xs font-normal py-2 px-3 rounded-md">Add signature</button>
                        </ModalTrigger>
                        <ModalContent>
                          <SignatureModal
                            onCreateSignature={handleCreateSignature}
                            index={index}
                          />
                        </ModalContent>
                      </Modal>
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