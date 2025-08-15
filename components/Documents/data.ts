import dayjs from "dayjs";
import {
  ArticlePayload,
  CheckboxOption,
  Document,
  DocumentsAPIResponse,
  DocumentsPageAPIResponse,
} from "./types";

export const transformDocumenArticleResponse = (
  response: DocumentsAPIResponse
): CheckboxOption[] => {
  const options = response.document.articles.map((article) => ({
    title: article.title,
    value: article.title.toLowerCase().replace(/\s+/g, "_"),
    description: article.content,
    section: article.section,
    summary: article.summary,
  }));

  return options;
};

export const transformArticlesForPayload = (
  options: CheckboxOption[]
): ArticlePayload[] => {
  return options.map((option) => ({
    title: option.title,
    content: option.description,
    section: option.section ? option.section : "",
    summary: option.summary ? option.summary : "",
  }));
};

export const transformDocuments = (
  response: DocumentsPageAPIResponse
): Document[] => {
  return response.documents.map((doc) => ({
    document_id: doc.document_id,
    property_name: doc.property_name,
    document_type: doc.document_type,
    property_id: doc.property_id,
    total_unit: doc.total_unit,
    created_date: doc.created_date,
    last_updated: dayjs(doc.last_updated).format("DD-MM-YYYY"),
  }));
};

const formatPhoneNumbers = (
  phoneNumber: string | string[] | null | undefined
): string => {
  if (!phoneNumber) return ""; 
  if (Array.isArray(phoneNumber)) {
    // Filter out null/undefined and join valid numbers with commas
    return phoneNumber.filter((num) => num != null).join(", ");
  }
  return phoneNumber; // Return as-is if it's a string
};
