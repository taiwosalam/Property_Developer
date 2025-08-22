"use client";

import React, { useEffect, useMemo, useState } from "react";

// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteDocumentModal from "@/components/Documents/delete-document-modal";
import DocumentTenancyAgreements from "@/components/Documents/document-tenancy-agreements";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import {
  ManageDocumentsAPIResponse,
  transformDocumentArticleResponse,
} from "./data";
import NetworkError from "@/components/Error/NetworkError";
import {
  SinglePropertyResponse,
  transformSinglePropertyData,
} from "../../management/properties/[id]/data";
import DOMPurify from "dompurify";
import CheckBoxLoader from "@/components/Loader/CheckBoxLoader";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import CardsLoading from "@/components/Loader/CardsLoading";
import { transformArticlesForPayload } from "@/components/Documents/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { TenancyAgreementPayload } from "@/components/Documents/types";
import { toast } from "sonner";
import { updatePropertyDocument } from "../data";

const ManageTenancyAgreement = () => {
  const documentId = useSearchParams().get("d") ?? "";
  const [reqLoading, setReqLoading] = useState(false);
  const router = useRouter();
  const { data, loading, error, isNetworkError } =
    useFetch<ManageDocumentsAPIResponse>(`/property-document/${documentId}`);

  const propertyID = data?.document?.property_id;

  const {
    data: propData,
    loading: propertyLoading,
    error: propertyError,
    isNetworkError: propertyNetworkError,
  } = useFetch<SinglePropertyResponse>(`property/${propertyID}/view`);

  const propertyData = propData ? transformSinglePropertyData(propData) : null;
  // const defaultOptions = data ? transformDocumentArticleResponse(data) : [];
  const defaultOptions = useMemo(
    () => (data ? transformDocumentArticleResponse(data) : []),
    [data]
  );

  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);
  const documentIdValue = data?.document?.document?.id;

  const handleOptionsChange = (options: CheckboxOption[]) => {
    setCheckboxOptions(options);
  };

  const handleUpdateDocument = async (type: "update" | "preview") => {
    const articles = transformArticlesForPayload(checkboxOptions);
    // console.log("checkboxOptions", checkboxOptions);
    const payload: TenancyAgreementPayload = {
      property_id: Number(propertyID),
      document_id: Number(documentIdValue),
      articles,
      _method: "PUT",
    };
    if (!payload.articles.length)
      return toast.warning("Please select at least one option to save");
    try {
      setReqLoading(true);
      const res = await updatePropertyDocument(
        Number(documentId),
        objectToFormData(payload)
        // payload
      );
      if (res) {
        toast.success("Document updated successfully");
        // Check if we should redirect back to Start Rent
        const startRentUnitId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("return_to_start_rent_unit_id")
            : null;
        if (startRentUnitId) {
          sessionStorage.removeItem("return_to_start_rent_unit_id");
          router.push(
            `/manager/management/rent-unit/${startRentUnitId}/start-rent?type=rental&id=${startRentUnitId}`
          );
          return;
        }
        if (type === "preview")
          router.push(`/manager/documents/preview/?d=${documentId}`);
        else {
          router.push(`/manager/documents`);
        }
      }
    } catch (err) {
      toast.error("An error occurred while updating the document");
    } finally {
      setReqLoading(false);
    }
  };

  // if (!documentIdValue || Number.isNaN(Number(documentIdValue))) {
  if (propertyLoading) {
    return (
      <div className="flex flex-col gap-4">
        <BackButton>Manage Tenancy Agreement</BackButton>
        <CardsLoading length={2} />
      </div>
    );
  }

  if (isNetworkError) return <NetworkError />;
  if (error) return <div> {error} </div>;

  const desc = DOMPurify.sanitize(data?.document?.property_description ?? "");
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-6">
        <BackButton customBackPath="/manager/documents">
          Manage Tenancy Agreement
        </BackButton>
        <LandlordTenantInfoBox className="custom-flex-col gap-[10px]">
          <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
            Property Details
          </h2>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{
                "property name": propertyData?.property_name ?? "--- ---",
                "property address": propertyData?.address ?? "--- ---",
                "agency fee":
                  propertyData?.agency_fee != null
                    ? `${propertyData.agency_fee}%`
                    : "--- ---",
                "property type": propertyData?.propertyType ?? "--- ---",
              }}
              chunkSize={2}
              referenceObject={{
                "property name": "",
                "property address": "",
                "agency fee": "",
                "property type": "",
              }}
            />
          </div>
        </LandlordTenantInfoBox>
        <LandlordTenantInfoBox className="custom-flex-col gap-[10px]">
          <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
            Landlord/Landlady Details
          </h2>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{
                "Landlord/Landlady Name":
                  propertyData?.landlord_info?.name ?? "--- ---",
                "Landlord/Landlady ID": propertyData?.landlord_id ?? "--- ---",
                "Landlord/Landlady Address": `${
                  propertyData?.landlord_info?.address ?? "---"
                } ${propertyData?.landlord_info?.city ?? "---"} ${
                  propertyData?.landlord_info?.state ?? "---"
                }`,
                "account type": propertyData?.landlordData?.agent ?? "--- ---",
              }}
              chunkSize={2}
              referenceObject={{
                "Landlord/Landlady Name": "",
                "Landlord/Landlady ID": "",
                "Landlord/Landlady Address": "",
                "account type": "",
              }}
            />
          </div>
        </LandlordTenantInfoBox>
      </div>
      <div className="custom-flex-col gap-8">
        <div className="custom-flex-col gap-4">
          <div className="custom-flex-col gap-1">
            <h2 className="text-primary-navy dark:text-white text-xl font-bold">
              Customized Agreement
            </h2>
            <p className="text-text-disabled dark:text-darkText-1 text-sm font-normal">
              Please choose any options below that are most applicable to the
              property agreement.
            </p>
          </div>
          <SectionSeparator />
        </div>
        {data && data.document && data.document.document.id ? (
          <DocumentTenancyAgreements
            id={Number(data.document.document.id)}
            defaultOptions={defaultOptions}
            onOptionsChange={handleOptionsChange}
          />
        ) : (
          <CheckBoxLoader />
        )}
      </div>
      <FixedFooter className="flex sm:flex-wrap gap-2 items-center justify-between ">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-4">
              delete document
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteDocumentModal documentId={Number(documentId)} />
          </ModalContent>
        </Modal>
        <div className="flex gap-4">
          <Button
            onClick={() => handleUpdateDocument("preview")}
            size="base_bold"
            variant="sky_blue"
            disabled={reqLoading}
            className="py-2 px-6 hidden md:block"
          >
            {reqLoading ? "Please wait..." : "Preview"}
          </Button>

          <Button
            onClick={() => handleUpdateDocument("update")}
            size="base_bold"
            disabled={reqLoading}
            className="py-2 px-6"
          >
            {reqLoading ? "Please wait..." : "Update"}
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageTenancyAgreement;
