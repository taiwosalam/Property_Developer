import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { CalendarIcon } from "@/public/icons/icons";
import { styled } from "@mui/system";

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
}));

interface CustomDatePickerProps {
  inputId: string;
  inputClassName?: string;
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
  containerClassName?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  inputClassName,
  inputId,
  containerClassName,
}: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={containerClassName}>
        <CustomStyledDatePicker
          disableFuture
          openTo="year"
          views={["year", "month", "day"]}
          value={value}
          onChange={(date) => {
            onChange?.(date);
          }}
          slots={{
            openPickerIcon: CalendarIcon,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              name: inputId,
              id: inputId,
              inputProps: {
                className: `date-input ${inputClassName}`,
                sx: {
                  height: "unset",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
