import clsx from "clsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { CalendarIcon } from "@/public/icons/icons";
import { styled } from "@mui/system";
import useDarkMode from "@/hooks/useCheckDarkMode";

// Override MUI styles using styled
const CustomStyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    font: "inherit",
    color: "inherit",
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #C1C2C366",
    transition: "border-color 0.3s ease",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00000099",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#0033C4",
    borderWidth: "2px",
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #C1C2C366",
  },
  "& .Mui-disabled": {
    color: "#FFF",
  },
}));

interface CustomDatePickerProps {
  inputId: string;
  inputClassName?: string;
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
  containerClassName?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  lastYear?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
}

export default function CustomDatePicker({
  value,
  onChange,
  inputClassName,
  inputId,
  containerClassName,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  disabled,
  lastYear,
}: CustomDatePickerProps) {
  const isDarkMode = useDarkMode();
  const CustomCalendarIcon = () => (
    <CalendarIcon {...(isDarkMode && { color: "#fff" })} />
  );
  // If lastYear is true, set minDate to one year ago from today, unless minDate is provided
  const computedMinDate = lastYear
    ? minDate || dayjs().subtract(1, "year")
    : minDate;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={clsx(
          "text-xs md:text-sm font-normal dark:bg-darkText-primary dark:hover:border-darkText-1",
          containerClassName
        )}
      >
        <CustomStyledDatePicker
          disabled={disabled}
          disableFuture={disableFuture}
          // disablePast={disablePast}
          disablePast={lastYear ? false : disablePast}
          // minDate={minDate}
          minDate={computedMinDate}
          maxDate={maxDate}
          openTo="year"
          views={["year", "month", "day"]}
          value={value}
          onChange={(date) => {
            onChange?.(date);
          }}
          slots={{
            openPickerIcon: CustomCalendarIcon,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              name: inputId,
              id: inputId,
              inputProps: {
                className: `date-input text-black dark:text-white ${inputClassName}`,
                sx: {
                  height: "unset",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                  ...(disabled && {
                    color: isDarkMode ? "#FFF !important" : "#000 !important",
                    WebkitTextFillColor: isDarkMode
                      ? "#FFF !important"
                      : "#000 !important",
                  }),
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
