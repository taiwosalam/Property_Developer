"use client";
import { ChangeEvent, SelectHTMLAttributes, useEffect, useState } from "react";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Select from "@/components/Form/Select/select";
// import { getAllStates, getLocalGovernments } from "@/utils/states";
import { tenantTypes, genderTypes, titles } from "@/data";
// import Input from "@/components/Form/Input/input";
// import PhoneNumberInput from "@/components/Form/PhoneNumberInput/phone-number-input";
import Button from "@/components/Form/Button/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import type { ValidationErrors } from "@/utils/types";
// import Picture from "@/components/Picture/picture";
// import Avatars from "@/components/Avatars/avatars";
// import TextArea from "@/components/Form/TextArea/textarea";
// import { DirectorCard } from "@/components/Settings/settings-components";
import UserCard from "@/components/Management/landlord-and-tenant-card";
import useFetch from "@/hooks/useFetch";
import { IPropertyApi, ITenantResponse, ITenantsApi } from "./types";
import { number } from "zod";
import { restrictUserFromGroupChat, showSelectedTenant } from "./data";
import { AxiosResponse } from "axios";
import { property } from "lodash";
import { toast } from "sonner";

interface RestrictUserFormProps {
  submitAction?: (data: any) => void;
  setRestrictedTenantId?: (prevState: number) => void;
  setIsUserRestricted?: (prevState: boolean) => void;
}

type Address = "selectedState" | "selectedLGA" | "selectedCity";

interface ITenantsWithId {
  id: number | null;
  name: string;
}
interface IPropertyWithId {
  id: number | null;
  title: string;
}

const RestrictUserForm: React.FC<RestrictUserFormProps> = ({
  submitAction,
  setRestrictedTenantId,
  setIsUserRestricted,
}) => {
  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader({
      placeholder: CameraCircle,
    });
  const [properties, setProperties] = useState<IPropertyWithId[] | null>(null);
  const [tenants, setTenants] = useState<ITenantsWithId[] | null>(null);

  const { data: propertyListResponse } =
    useFetch<IPropertyApi>("/property/list");
  const { data: tenantListResponse } = useFetch<ITenantsApi>("all-tenants");

  useEffect(() => {
    if (propertyListResponse) {
      const propertyList = propertyListResponse?.data?.properties?.data?.map(
        (item) => {
          return {
            id: item?.id,
            title: item?.title,
          };
        }
      );
      setProperties(propertyList);
    }
    if (tenantListResponse) {
      const tenantList = tenantListResponse?.data?.tenants.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      setTenants(tenantList);
    }
  }, [propertyListResponse, tenantListResponse]);

  const [state, setState] = useState({
    selectedState: "",
    selectedLGA: "",
    activeAvatar: "",
    errorMsgs: {} as ValidationErrors,
  });

  const [selectedTenant, setSelectedTenant] = useState<{
    id: number | null;
    name: string | null;
  }>({
    id: null,
    name: null,
  });

  const { selectedState, selectedLGA, activeAvatar, errorMsgs } = state;
  const [tenantUser, setTenantUser] = useState<ITenantResponse | null>(null);
  const [selectedProperty, setSelectedProperty] =
    useState<IPropertyWithId | null>(null);
  const [restricting, setRestricting] = useState(false);
  const [tenantIds, setTenantIds] = useState<number[]>([]);
  const { data: propertyWithId } = useFetch<any>(
    selectedProperty ? `property/${selectedProperty.title}/view` : null
  );
  const [propertyTenants, setPropertyTenants] = useState<ITenantResponse[]>([]);

  // Add new fetch hook for tenant profiles
  const { data: tenantProfiles } = useFetch<any>(
    tenantIds.length ? `tenant/${tenantIds.join(",")}` : null
  );

  console.log(tenantProfiles, "tenantProfiles");

  useEffect(() => {
    if (tenantProfiles) {
      // Update the tenants state with the fetched profiles
      const filteredTenants = tenantProfiles.data;
      const profileTenants = {
        id: filteredTenants?.id as number,
        name: filteredTenants?.name as string,
          // filteredTenants?.agent !== "Web"
          //   ? filteredTenants?.name
          //   : "No Tenant",
      };
      setTenants([profileTenants]);
    }
  }, [tenantProfiles]);

  useEffect(() => {
    if (propertyWithId) {
      const transformedData = [
        ...new Set(
          propertyWithId?.data?.units
            .map((item: any) => item.tenant_id)
            .filter(Boolean)
        ),
      ];
      setTenantIds(transformedData as number[]);
    }
  }, [propertyWithId]);

  useEffect(() => {
    if (selectedTenant && selectedTenant.name) {
      const getTenant = async () => {
        if (selectedTenant.name) {
          const res = await showSelectedTenant(selectedTenant.name);
          if (res) {
            setTenantUser(res as ITenantResponse);
          }
        }
      };
      getTenant();
    }
  }, [selectedTenant]);

  useEffect(() => {
    if (selectedProperty) {
      if (setRestrictedTenantId) {
        setRestrictedTenantId(Number(selectedProperty?.title));
      }
    }
  }, [selectedTenant]);

  const handleRestrictUserAction = async () => {
    if (!selectedTenant?.name || !selectedProperty?.title) {
      console.warn("Both tenant and property must be selected.");
      return;
    }
    const payload = {
      property_id: Number(selectedProperty.title),
      user_id: Number(selectedTenant.name),
      is_active: false,
    };
    setRestricting(true);
    try {
      const response = await restrictUserFromGroupChat(payload);
      if (response) {
        toast.success("User restricted");
        setIsUserRestricted?.(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRestricting(false);
    }
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleRestrictUserAction}
      className="custom-flex-col gap-5 overflow-visible z-[100]"
      setValidationErrors={(errors: ValidationErrors) =>
        setState((prevState) => ({ ...prevState, errorMsgs: errors }))
      }
    >
      {tenantUser && (
        <div className="flex items-center justify-center">
          <UserCard
            name={tenantUser?.data?.data?.name ?? "___ ___"}
            email={tenantUser?.data?.data?.email ?? "___ ___"}
            phone_number={tenantUser?.data?.data?.phone ?? "___ ___"}
            picture_url={tenantUser?.data?.data?.picture ?? "/avatar.png"}
            user_tag={tenantUser?.data?.data?.agent ?? "Web"}
          />
        </div>
      )}
      <div className="flex items-center justify-center gap-8 w-full z-[10000]">
        <Select
          validationErrors={errorMsgs}
          options={
            properties && property.length > 0
              ? properties.map((item) => ({
                  value: item.id ?? "",
                  label: item.title,
                })) // Ensure it's an object
              : []
          }
          id="property"
          label="Select Property"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(selected: string) => {
            if (!selected) {
              setSelectedProperty(null);
            }
            const property =
              properties && properties.find((item) => item.title === selected);
            if (property) {
              setSelectedProperty({ id: property.id, title: property.title });
            } else {
              setSelectedProperty((prev) => ({
                ...prev,
                id: prev?.id ?? null,
                title: selected,
              }));
            }
          }}
        />
        <Select
          validationErrors={errorMsgs}
          options={
            tenants && tenants.length > 0
              ? tenants.map((item) => ({
                  value: item.id ?? "",
                  label: item.name,
                })) // Ensure it's an object
              : []
          }
          id="tenants_name"
          label="Tenants Name"
          placeholder="Select options"
          inputContainerClassName="bg-neutral-2"
          value={selectedState}
          onChange={(selected: string) => {
            if (!selected) {
              setTenantUser(null);
            }
            const tenant = tenants?.find((tenant) => tenant.name === selected);
            if (tenant) {
              setSelectedTenant({ id: tenant.id, name: tenant.name });
            } else {
              setSelectedTenant((prev) => ({ ...prev, name: selected }));
            }
          }}
        />
      </div>
      <div className="flex w-full items-end justify-end">
        <Button
          type="submit"
          size="base_bold"
          variant="light_red"
          className={`py-2 px-8 ml-auto ${
            restricting ? "opacity-70" : "opacity-100"
          }`}
        >
          {restricting ? "Please wait..." : "Restrict User"}
        </Button>
      </div>
    </AuthForm>
  );
};

export default RestrictUserForm;
