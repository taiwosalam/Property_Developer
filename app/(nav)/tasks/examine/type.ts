

export type ExamineApiResponse = {
  status: "success";
  total_examine: number;
  total_examine_month: number;
  data: ExamineItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

type ExamineItem = {
  id: number;
  title: string;
  description: string;
  examine_date: string; // e.g., "20th January 2026"
  image: string[]; // Assuming it's an array of image URLs; adjust if structure differs
};

