"use client";
import PropertyPreview from "@/components/Management/Properties/property-preview";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import useFetch from "@/hooks/useFetch";
import {
  type SinglePropertyResponse,
  transformSinglePropertyData,
} from "./data";
import NetworkError from "@/components/Error/NetworkError";

const PropertyPreviewPage = ({ params }: { params: { id: string } }) => {
  const { data, loading, error, isNetworkError } =
    useFetch<SinglePropertyResponse>(`property/${params.id}/view`);

  const propertyData = data ? transformSinglePropertyData(data) : null;

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div>{error}</div>;
  if (!propertyData) return <div>No property data found</div>;

  return <PropertyPreview {...propertyData} />;
};

export default PropertyPreviewPage;
