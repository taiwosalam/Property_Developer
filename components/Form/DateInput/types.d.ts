import { Dayjs } from "dayjs";
export interface DateInputProps {
  id: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  defaultValue?: Dayjs | null;
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disableFuture?: boolean;
  disablePast?: boolean;
  containerClassName?: string;
  labelclassName?: string;
  disabled?: boolean;
}
