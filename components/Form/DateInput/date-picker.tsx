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
    // fontFamily: "unset",
    // fontWeight: "unset",
    // fontSize: "unset",
    // color: "unset",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    // borderColor: "unset", // Customize the border color if needed
  },
  "& .MuiInputLabel-root": {
    // fontFamily: "unset",
    // fontWeight: "unset",
    // fontSize: "unset",
    // color: "unset",
  },
  "& .MuiSvgIcon-root": {
    // color: "unset", // Customize the color of the icons if needed
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
