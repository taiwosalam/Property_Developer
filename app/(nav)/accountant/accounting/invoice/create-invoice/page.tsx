"use client";

import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { SectionSeparator } from "@/components/Section/section-components";
import { empty } from "@/app/config";
import { useEffect, useState } from "react";
import ExportPageHeader from "@/components/reports/export-page-header";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import {
  SinglePropertyResponse,
  transformSinglePropertyData,
} from "@/app/(nav)/management/properties/[id]/data";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import CardsLoading from "@/components/Loader/CardsLoading";
import {
  createInvoice,
  getPropertyTenants,
  parseFormattedNumber,
  PropertyTenantResponse,
  PropertyTenantsApiResponse,
} from "./data";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import { AuthForm } from "@/components/Auth/auth-components";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { currencySymbols } from "@/utils/number-formatter";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import { ExclamationMark } from "@/public/icons/icons";
import { useTourStore } from "@/store/tour-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useRole } from "@/hooks/roleContext";

const CreateInvoicePage = () => {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("p");
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const [reqLoading, setReqLoading] = useState(false);
  const [isAddPaymentChecked, setIsAddPaymentChecked] = useState(true);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantsData, setTenantsData] =
    useState<PropertyTenantsApiResponse | null>(null);
  const [tenantsError, setTenantsError] = useState<string | null>(null);

  const handleGenerateInvoiceCheckboxChange = (checked: boolean) => {
    setIsSelectDisabled(checked);
  };
  const [selectedTenant, setSelectedTenant] = useState("");

  const [paymentAmount, setPaymentAmount] = useState("");
  const { role } = useRole();

  const navigateRoute = () => {
    switch (role) {
      case "manager":
        router.push("/manager/accounting/invoice");
        break;
      case "staff":
        router.push("/staff/accounting/invoice");
        break;
      case "account":
        router.push("/accountant/accounting/invoice");
        break;
      default:
        router.push("/accounting/invoice");
        break;
    }
  };

  // PROPERTY SELECTION LOGIC
  const propertyURL =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/property/all?branch_id=${BRANCH_ID}`
      : null;
  const [selectedProperty, setSelectedProperty] = useState<number>(0);
  const {
    data: properties,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>(propertyURL);

  const propertyOptions =
    properties?.data
      .filter((p) => p.has_unit)
      .map((p) => ({
        value: `${p.id}`,
        label: p.title,
      })) || [];

  useEffect(() => {
    const fetchTenants = async () => {
      setTenantLoading(true);
      setTenantsError(null);

      try {
        const data = await getPropertyTenants(selectedProperty);
        if (data) {
          setTenantsData(data);
        } else {
          setTenantsData(null);
          setTenantsError("No tenants found");
        }
      } catch (error) {
        setTenantsError("Error loading tenants");
        setTenantsData(null);
      } finally {
        setTenantLoading(false);
      }
    };

    if (selectedProperty) {
      fetchTenants();
    } else {
      setTenantsData(null);
      setTenantsError(null);
    }
  }, [selectedProperty]);

  useEffect(() => {
    setSelectedTenant("");
  }, [selectedProperty]);

  const TENANT_OPTIONS =
    tenantsData?.tenants.map((t) => ({
      value: t.id,
      label: t.name,
      icon: t.picture,
    })) || [];

  const { data, loading, error, isNetworkError } =
    useFetch<SinglePropertyResponse>(
      selectedProperty ? `property/${selectedProperty}/view` : null
    );
  const propertyData = data ? transformSinglePropertyData(data) : null;

  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  const pathname = usePathname();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("CreateInvoiceTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  const AUTO_OPTIONS = [
    { value: "once", label: "Once" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const handleCreateInvoice = async (data: any) => {
    if (!data.tenant_name) {
      return toast.warning("Please select a tenant");
    }
    const payload = {
      property_id: selectedProperty,
      tenant_id: data.tenant_name ?? "",
      amount: parseFormattedNumber(data.amount),
      description: data.description,
      auto_generate: data.auto_generate ?? "",
      is_auto: isSelectDisabled ? "true" : "false",
    };

    try {
      setReqLoading(true);
      const res = await createInvoice(objectToFormData(payload));
      if (res) {
        toast.success("Invoice Created Successfully");
        navigateRoute();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReqLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="custom-flex-col gap-2">
        <CardsLoading length={5} />
      </div>
    );
  }
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  // const CURRENCY =
  //   currencySymbols[propertyData?.currency as keyof typeof currencySymbols] ||
  //   currencySymbols["naira"];

  return (
    <section className="space-y-7 pb-20">
      <div className="flex gap-2 items-center">
        <BackButton>Create New Invoice</BackButton>
        <button
          onClick={() => restartTour(pathname)}
          type="button"
          className="text-orange-normal"
        >
          <ExclamationMark />
        </button>
      </div>

      {/* <ExportPageHeader /> */}
      <AuthForm
        onFormSubmit={handleCreateInvoice}
        className="custom-flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <div className="property-card">
            {/* <Details
              property_id={propertyData?.id}
              property_name={propertyData?.property_name}
              account_officer={propertyData?.account_officer}
            /> */}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Select
              id="property"
              className="property-selection-dropdown"
              label={`Choose Property`}
              options={propertyOptions}
              disabled={propertyLoading}
              placeholder={
                propertyLoading
                  ? "Loading properties..."
                  : propertyError
                  ? "Failed to load properties"
                  : "Select a property"
              }
              onChange={(value) => setSelectedProperty(Number(value))}
            />

            <SelectWithImage
              id="tenant_name"
              options={TENANT_OPTIONS}
              label="Tenant/Occupant"
              className="tenant-unit-selection"
              disabled={isSelectDisabled || tenantLoading}
              resetKey={selectedProperty}
              placeholder={
                tenantLoading
                  ? "Loading Tenants"
                  : tenantsError
                  ? tenantsError
                  : TENANT_OPTIONS.length === 0
                  ? "No Tenants Found"
                  : "Select Tenant"
              }
              onChange={setSelectedTenant}
            />

            <Checkbox
              className="generate-invoice-checkbox self-end items-start text-left"
              checked={isSelectDisabled}
              onChange={handleGenerateInvoiceCheckboxChange}
            >
              Click to generate invoice for all tenants and occupants of this
              property (mobile users)
            </Checkbox>
            <Select
              id="auto_generate"
              className="auto-regenerate-type"
              options={AUTO_OPTIONS}
              label="Auto Generate"
              placeholder="Select Options"
              disabled={!isSelectDisabled}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              type="text"
              id="amount"
              label="Amount"
              className="amount-input w-full"
              // CURRENCY_SYMBOL={CURRENCY}
              formatNumber
              value={paymentAmount}
              onChange={setPaymentAmount}
              // onChange={(value) => setPaymentAmount(value as string)}
            />
          </div>

          <TextArea
            id="description"
            label="Description"
            required
            className="invoice-description-textarea lg:max-w-[50%]"
          />
        </div>

        <FixedFooter className="flex items-center justify-end gap-4">
          {/* <Button className="py-2 px-8" size="base_medium" variant="sky_blue">
          Cancel
          </Button> */}
          <Button
            disabled={reqLoading}
            type="submit"
            className="create-invoice-button py-2 px-8"
            size="base_medium"
          >
            {reqLoading ? "Please wait..." : "Create Invoice"}
          </Button>
        </FixedFooter>
      </AuthForm>
    </section>
  );
};

export default CreateInvoicePage;
