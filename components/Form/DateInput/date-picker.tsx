import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { CalendarIcon } from "@/public/icons/icons";
import { styled, width } from "@mui/system";

// Override MUI styles using styled
const CustomStyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiFormControl-root.MuiTextField-root": {
    width: "100%",
  },
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
  containerClassName?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
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
        />
      </div>
    </LocalizationProvider>
  );
}
