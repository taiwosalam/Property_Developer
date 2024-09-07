import { Dayjs } from "dayjs";
export interface DateInputProps {
  id: string;
  label?: string;
  required?: boolean;
  className?: string;
  hiddenInputClassName?: string;
  value?: Dayjs | null;
  onChange?: (date?: Dayjs | null) => void;
}
