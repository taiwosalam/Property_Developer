"use client";

import React, { useMemo } from "react";

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
import { useSearchParams } from "next/navigation";
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

const ManageTenancyAgreement = () => {
  const documentId = useSearchParams().get("d") ?? "";

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
  const documentIdValue = data?.document?.document?.id;

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
        <BackButton>Manage Tenancy Agreement</BackButton>
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
            href={`/documents/preview/?d=${documentId}`}
            variant="sky_blue"
            size="base_bold"
            className="py-2 px-6"
          >
            Preview
          </Button>
          <Button
            // onClick={handleSaveDraft}
            size="base_bold"
            className="py-2 px-6"
          >
            Save
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageTenancyAgreement;
