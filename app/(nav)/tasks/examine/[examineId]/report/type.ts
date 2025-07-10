

export type ExamineReportApiResponse = {
  status: "success";
  data: {
    id: number;
    title: string;
    description: string;
    examine_date: string;
    company: {
      name: string;
      logo: string;
      address: string;
      website: string | null;
      email: string;
      phone: string;
    };
    added_guest: string;
    assign_staff: string;
    image: {
      path: string;
    }[];
    service: string[];
    inspection_checklist: {
      [key: string]: "Bad" | "Good" | string;
    }[];
    inspection_summary: {
      [key: string]: string;
    }[];
    inspection_summary_note: string;
  };
};
