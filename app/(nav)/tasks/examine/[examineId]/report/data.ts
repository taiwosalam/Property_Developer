import { ExamineReportApiResponse } from "./type";

export interface IExamineReportPageData {
  id: number;
  inspection_date: string;
  guest: string;
  assign_staff: string;
  description: string;
  services: string[];
  inspection_checklist: {
    [key: string]: string;
  }[];
  inspection_summary: {
    [key: string]: string;
  }[];
  summary_note: string;
}

export const transformExamineReportPageData = (
  res: ExamineReportApiResponse
): IExamineReportPageData => {
  const { data } = res;
  return {
    id: data?.id,
    inspection_date: data?.examine_date || "___ ___",
    description: data?.description || "___ ___",
    guest: data?.added_guest || "___ ___",
    assign_staff: data?.assign_staff || "___ ___",
    services:
      data?.service?.length > 0
        ? data?.service?.map((service) => (service ? service : "N/A"))
        : [],
    inspection_checklist: data?.inspection_checklist?.length
      ? data?.inspection_checklist?.map((checklist) => checklist)
      : [],
    inspection_summary: data?.inspection_summary?.length
      ? data?.inspection_summary?.map((summary) => summary)
      : [],
    summary_note: data?.inspection_summary_note,
  };
};
