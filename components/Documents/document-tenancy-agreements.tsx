"use client";
import React, { useEffect, useState } from "react";
// Imports
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import useFetch from "@/hooks/useFetch";
import { transformDocumenArticleResponse } from "./data";
import { CheckboxOption, DocumentsAPIResponse } from "./types";
import DOMPurify from "dompurify";
import NetworkError from "../Error/NetworkError";
import CheckBoxLoader from "../Loader/CheckBoxLoader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DocumentTenancyAgreementsProps {
  id: number;
  defaultOptions?: CheckboxOption[];
  onOptionsChange?: (options: CheckboxOption[]) => void;
}

const DocumentTenancyAgreements: React.FC<DocumentTenancyAgreementsProps> = ({
  id,
  onOptionsChange,
  defaultOptions = [],
}) => {
  const router = useRouter();

  const { data, loading, error, isNetworkError } =
    useFetch<DocumentsAPIResponse>(`/property-document/documents/${id}`);

  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<CheckboxOption[]>([]);

  console.log("id", id)

  // Set up options from API data
  useEffect(() => {
    if (data) {
      const options = transformDocumenArticleResponse(data);
      setCheckboxOptions(options);

      // Initialize selected options based on defaultOptions if available
      if (defaultOptions && defaultOptions.length > 0) {
        // Find matching options from API data and default options
        const initialSelected = options.filter((option) =>
          defaultOptions.some((defaultOpt) => defaultOpt.value === option.value)
        );
        setSelectedOptions(initialSelected);

        if (onOptionsChange) {
          onOptionsChange(initialSelected);
        }
      }
    }
  }, [data, defaultOptions]);

  // Toggle the selected option when a DocumentCheckbox is clicked
  const handleOptionToggle = (option: CheckboxOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((item) => item.value === option.value);
      if (exists) {
        const filtered = prev.filter((item) => item.value !== option.value);
        if (onOptionsChange) onOptionsChange(filtered);
        return filtered;
      } else {
        const newSelected = [...prev, option];
        if (onOptionsChange) onOptionsChange(newSelected);
        return newSelected;
      }
    });
  };

  // Check if an option is selected
  const isOptionSelected = (option: CheckboxOption) => {
    return selectedOptions.some((item) => item.value === option.value);
  };

  
  if (isNetworkError) return <NetworkError />;
  if (error) return <div>{error}</div>;
  if (loading) return <CheckBoxLoader />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {checkboxOptions.map((option) => (
        <DocumentCheckbox
          onClick={() => handleOptionToggle(option)}
          key={option.value}
          title={option.title}
          checked={isOptionSelected(option)}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(option.description),
            }}
          />
        </DocumentCheckbox>
      ))}
    </div>
  );
};

export default DocumentTenancyAgreements;
