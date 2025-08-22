"use client";
import React, { useEffect, useState, useRef } from "react";
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
  const isInitialized = useRef(false); // Track initialization

  useEffect(() => {
    if (data && !isInitialized.current) {
      const options = transformDocumenArticleResponse(data);
      // Only update checkboxOptions if different
      setCheckboxOptions((prev) => {
        const isSame =
          prev.length === options.length &&
          prev.every((opt, i) => opt.value === options[i]?.value);
        return isSame ? prev : options;
      });

      // Initialize selected options based on defaultOptions
      if (defaultOptions.length > 0) {
        const initialSelected = options.filter((option) =>
          defaultOptions.some((defaultOpt) => defaultOpt.value === option.value)
        );
        setSelectedOptions(initialSelected);
        if (onOptionsChange) onOptionsChange(initialSelected);
      } else {
        setSelectedOptions([]);
        if (onOptionsChange) onOptionsChange([]);
      }
      isInitialized.current = true; // Mark as initialized
    }
  }, [data, defaultOptions, onOptionsChange]);

  // Toggle the selected option when a DocumentCheckbox is clicked
  const handleOptionToggle = (option: CheckboxOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((item) => item.value === option.value);
      let newSelected: CheckboxOption[];
      if (exists) {
        newSelected = prev.filter((item) => item.value !== option.value);
      } else {
        newSelected = [...prev, option];
      }
      if (onOptionsChange) onOptionsChange(newSelected);
      console.log("newSelected", newSelected); // Debugging
      return newSelected;
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
              // __html: DOMPurify.sanitize(option.description),
              __html: DOMPurify.sanitize(option.summary),
            }}
          />
        </DocumentCheckbox>
      ))}
    </div>
  );
};

export default DocumentTenancyAgreements;
