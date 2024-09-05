export interface PaginationProps {
  className?: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
