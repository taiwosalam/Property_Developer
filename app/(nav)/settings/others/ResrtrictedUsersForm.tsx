"use client";
import { useEffect, useState } from "react";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import type { ValidationErrors } from "@/utils/types";
import UserCard from "@/components/Management/landlord-and-tenant-card";
import useFetch from "@/hooks/useFetch";
import { IPropertyApi, ITenantResponse, ITenantsApi } from "./types";
import { restrictUserFromGroupChat, showSelectedTenant } from "./data";
import { toast } from "sonner";

interface RestrictUserFormProps {
  submitAction?: (data: any) => void;
  setRestrictedTenantId?: (id: number) => void;
  setIsUserRestricted?: (isRestricted: boolean) => void;
}

interface IPropertyWithId {
  id: number;
  title: string;
}

interface ITenantsWithId {
  id: number;
  name: string;
}

const RestrictUsersForm: React.FC<RestrictUserFormProps> = ({
  submitAction,
  setRestrictedTenantId,
  setIsUserRestricted,
}) => {
  const [properties, setProperties] = useState<IPropertyWithId[]>([]);
  const [tenants, setTenants] = useState<ITenantsWithId[]>([]);
  const [selectedProperty, setSelectedProperty] =
    useState<IPropertyWithId | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<ITenantsWithId | null>(
    null
  );
  const [tenantUser, setTenantUser] = useState<ITenantResponse | null>(null);
  const [restricting, setRestricting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const {
    data: propertyListResponse,
    loading: propertyLoading,
    silentLoading: propertySilentLoading,
  } = useFetch<IPropertyApi>("/property/list");
  const { data: propertyWithId } = useFetch<any>(
    selectedProperty ? `property/${selectedProperty.id}/view` : null
  );
  const {
    data: propertyTenants,
    loading: loadingTenants,
    silentLoading: tenantSilentLoading,
  } = useFetch<[{ id: number; name: string }]>(
    selectedProperty?.id ? `/property-tenants/${selectedProperty?.id}` : null
  );

  // Populate properties and tenants from API responses
  useEffect(() => {
    if (propertyListResponse?.data?.properties?.data) {
      const propertyList = propertyListResponse.data.properties.data
        .filter((item) => item?.id && item?.title)
        .map((item) => ({
          id: item.id,
          title: item.title,
        }));
      setProperties(propertyList);
    }

    if (propertyTenants) {
      const tenantList =
        propertyTenants.length > 0
          ? propertyTenants.map((t) => ({
              id: t.id,
              name: t.name,
            }))
          : [];
      setTenants(tenantList);
    }
  }, [propertyListResponse, propertyTenants]);

  console.log(selectedProperty);

  // Update tenant IDs based on selected property
  useEffect(() => {
    if (propertyWithId?.data?.units) {
      const tenantIds = [
        ...new Set(
          propertyWithId.data.units
            .map((item: any) => item.tenant_id)
            .filter(Boolean)
        ),
      ] as number[];

      // Filter tenants to only those associated with the selected property
      const filteredTenants = tenants.filter((tenant) =>
        tenantIds.includes(tenant.id)
      );
      setTenants(
        filteredTenants.length > 0
          ? filteredTenants
          : [{ id: -1, name: "No Tenants Available" }]
      );

      // Reset tenant selection when property changes
      setSelectedTenant(null);
      setTenantUser(null);
    }
  }, [propertyWithId]);

  const [loadingTenant, setTenantLoading] = useState(false);

  // Fetch tenant details when a tenant is selected
  useEffect(() => {
    const fetchTenant = async () => {
      if (selectedTenant?.name && selectedTenant.id !== -1) {
        try {
          setTenantLoading(true);
          const res = await showSelectedTenant(selectedTenant.id.toString());
          if (res) {
            setTenantUser(res.data as ITenantResponse);
          }
        } catch (error) {
          console.error("Error fetching tenant:", error);
          toast.error("Failed to fetch tenant details");
        } finally {
          setTenantLoading(false);
        }
      }
    };
    fetchTenant();
  }, [selectedTenant, selectedProperty]);

  // Update restricted tenant ID when selected property changes
  useEffect(() => {
    if (selectedProperty && setRestrictedTenantId) {
      setRestrictedTenantId(selectedProperty.id);
    }
  }, [selectedProperty, setRestrictedTenantId]);

  const handleRestrictUserAction = async () => {
    if (!selectedProperty || !selectedTenant || selectedTenant.id === -1) {
      toast.error("Please select a valid property and tenant");
      return;
    }

    const payload = {
      property_id: selectedProperty.id,
      user_id: selectedTenant.id,
      is_active: false,
    };

    setRestricting(true);
    try {
      const response = await restrictUserFromGroupChat(payload);
      if (response) {
        toast.success("User restricted successfully");
        setIsUserRestricted?.(false);
      }
    } catch (error) {
      console.error("Error restricting user:", error);
      toast.error("Failed to restrict user");
    } finally {
      setRestricting(false);
    }
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleRestrictUserAction}
      className="custom-flex-col gap-5 overflow-visible z-[100]"
      setValidationErrors={setValidationErrors}
    >
      {tenantUser && selectedTenant?.id !== -1 && (
        <div className="flex items-center justify-center">
          <UserCard
            name={tenantUser?.data?.name ?? "Unknown"}
            email={tenantUser?.data?.email ?? "Unknown"}
            phone_number={
              tenantUser?.data?.phone.profile_phone ||
              tenantUser?.data?.phone.user_phone ||
              ""
            }
            picture_url={tenantUser?.data?.picture ?? "/avatar.png"}
            user_tag={tenantUser?.data?.agent ?? "Web"}
          />
        </div>
      )}
      <div className="flex items-center justify-center gap-8 w-full z-[10000]">
        <Select
          className="w-[280px]"
          validationErrors={validationErrors}
          options={properties.map((item) => ({
            value: item.id.toString(),
            label: item.title,
          }))}
          id="property"
          label="Select Property"
          placeholder={
            propertyLoading || propertySilentLoading
              ? "Loading..."
              : "Select a property"
          }
          disabled={propertyLoading || properties.length === 0}
          inputContainerClassName="bg-neutral-2"
          value={selectedProperty?.title || ""}
          onChange={(value: string) => {
            const property = properties.find(
              (item) => item.id.toString() === value
            );
            setSelectedProperty(property || null);
            setSelectedTenant(null); // Reset tenant when property changes
            setTenantUser(null);
          }}
        />
        <Select
          className="w-[280px]"
          validationErrors={validationErrors}
          options={tenants.map((item) => ({
            value: item.id.toString(),
            label: item.name,
          }))}
          id="tenants_name"
          label="Tenants Name"
          placeholder={
            loadingTenants || tenantSilentLoading
              ? "Loading..."
              : selectedProperty && tenants.length === 0
              ? "No available tenants"
              : selectedProperty && tenants.length > 0
              ? "Select tenant"
              : "Select Options"
          }
          disabled={
            loadingTenants ||
            !selectedProperty ||
            tenants.length === 0 ||
            tenants[0].id === -1
          }
          inputContainerClassName="bg-neutral-2"
          value={selectedTenant?.name || ""}
          onChange={(value: string) => {
            const tenant = tenants.find((item) => item.id.toString() === value);
            setSelectedTenant(tenant || null);
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
          disabled={
            restricting ||
            !selectedProperty ||
            !selectedTenant ||
            selectedTenant.id === -1
          }
        >
          {restricting ? "Please wait..." : "Restrict User"}
        </Button>
      </div>
    </AuthForm>
  );
};

export default RestrictUsersForm;
