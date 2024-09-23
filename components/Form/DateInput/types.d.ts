import { Dayjs } from "dayjs";
export interface DateInputProps {
  id: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  value?: Dayjs | null;
  onChange?: (date?: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disableFuture?: boolean;
  disablePast?: boolean;
}
