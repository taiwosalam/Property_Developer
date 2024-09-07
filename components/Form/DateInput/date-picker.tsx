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
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00000099",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #C1C2C366",
  },
}));

interface CustomDatePickerProps {
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
}

export default function CustomDatePicker({
  value,
  onChange,
}: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      />
    </LocalizationProvider>
  );
}
