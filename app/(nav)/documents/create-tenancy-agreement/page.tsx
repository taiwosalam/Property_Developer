"use client";

// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteDocumentModal from "@/components/Documents/delete-document-modal";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";
import DocumentTenancyAgreements from "@/components/Documents/document-tenancy-agreements";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useDrawerStore } from "@/store/drawerStore";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import {
  SinglePropertyResponse,
  transformSinglePropertyData,
} from "../../management/properties/[id]/data";
import NetworkError from "@/components/Error/NetworkError";
import { useState } from "react";
import { transformArticlesForPayload } from "@/components/Documents/data";
import { TenancyAgreementPayload } from "@/components/Documents/types";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { createPropertyDocument } from "../data";
import { property } from "lodash";

const CreateTenancyAggrement = () => {
  const router = useRouter();
  const [reqLoading, setReqLoading] = useState(false);
  const propertyId = useSearchParams().get("p") ?? "";
  const { setSelectedLegalOption, selectedLegalOption } = useDrawerStore();
  const [next, setNext] = useState(false);
  const documentId = selectedLegalOption?.id ?? 0;

  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);

  // Callback to update checkbox options from DocumentTenancyAgreements component
  const handleOptionsChange = (options: CheckboxOption[]) => {
    setCheckboxOptions(options);
  };

  const { data, loading, error, isNetworkError } =
    useFetch<SinglePropertyResponse>(`property/${propertyId}/view`);
  const propertyData = data ? transformSinglePropertyData(data) : null;

  const handleSaveDraft = async () => {
    const articles = transformArticlesForPayload(checkboxOptions);
    const payload: TenancyAgreementPayload = {
      property_id: Number(propertyId),
      document_id: documentId,
      articles,
    };
    if (!payload.articles.length)
      return toast.warning("Please select at least one option to save draft");
    try {
      setReqLoading(true)
      const res = await createPropertyDocument(objectToFormData(payload));
      if (res) {
        toast.success("Draft saved successfully");
        router.push("/documents")
        // setNext(true);
      }
    } catch (err) {
      toast.error("An error occurred while saving the draft");
    } finally {
      setReqLoading(false);
    }
  };

  // console.log("here bro", propertyData);

  if (isNetworkError) return <NetworkError />;
  if (error) return <div>{error}</div>;
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-6">
        <BackButton>Create Tenancy Agreement</BackButton>
        <LandlordTenantInfoBox className="custom-flex-col gap-[10px]">
          <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
            Property Details
          </h2>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{
                "property name": propertyData?.property_name || "--- ---",
                "property address": propertyData?.address || "--- ---",
                "agency fee": propertyData?.agency_fee != null ? `${propertyData.agency_fee}%` : "--- ---",
                "property type": propertyData?.propertyType || "--- ---",
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
                  propertyData?.landlord_info?.name || "--- ---",
                "Landlord/Landlady ID": propertyData?.landlord_id || "--- ---",
                "Landlord/Landlady Address": `${
                  propertyData?.landlord_info?.address || "---"
                } ${propertyData?.landlord_info?.city || "---"} ${
                  propertyData?.landlord_info?.state || "---"
                }`,
                "account type": propertyData?.landlordData?.agent || "--- ---",
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
            <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
              Agreement Customization
            </h2>
            <p className="text-text-disabled text-sm font-normal">
              Please select any of the options below that applies to the
              agreement
            </p>
          </div>
          <SectionSeparator />
        </div>
        <DocumentTenancyAgreements
          id={documentId}
          onOptionsChange={handleOptionsChange}
        />
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-6">
              delete account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteDocumentModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button
            variant="sky_blue"
            size="base_bold"
            onClick={() => {
              if (next) {
                router.push(`/documents/preview/?d=${documentId}`);
              } else {
                toast.warning("Please save as draft before previewing");
              }
            }}
            className="py-2 px-6"
          >
            print & preview
          </Button>
          <Button
            onClick={handleSaveDraft}
            size="base_bold"
            className="py-2 px-6"
          >
            { reqLoading ? "Please wait..." : "Save as draft" }
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default CreateTenancyAggrement;
