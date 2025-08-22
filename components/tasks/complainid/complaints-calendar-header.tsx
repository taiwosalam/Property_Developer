import { format } from "date-fns";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useCalendar } from "@/components/Calendar/calendar-context";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";

const ComplaintsCalendarHeader: React.FC<{
  header: string;
}> = ({ header }) => {
  const { nextMonth, prevMonth, targetDate, year, setYear } = useCalendar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleYearSelect = (selectedYear: number) => {
    setYear?.(selectedYear);
    handleClose();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 bg-brand-1 py-4 px-6 rounded-t-lg">
        <div className="space-y-2">
          <p className="text-black text-base font-medium">{header}</p>
          <button
            className="text-text-label text-sm font-medium flex items-center gap-1"
            type="button"
            onClick={handleClick}
            aria-controls={anchorEl ? "year-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
          >
            {format(targetDate, "MMMM yyyy")} <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={prevMonth} className="p-1">
            <ArrowLeft size={18} color="#696B70" />
          </button>
          <button type="button" onClick={nextMonth} className="p-1">
            <ArrowRight size={18} color="#696B70" />
          </button>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        MenuListProps={{
          "aria-labelledby": "dropdown-button",
          sx: {
            padding: 0,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
              "& .MuiMenuItem-root": {
                // padding: "12px 26px",
                boxShadow: "none",
                fontSize: "1rem",
                textTransform: "capitalize",
              },
            },
          },
        }}
      >
        {[...Array(10)].map((_, index) => {
          const yearOption = year - 5 + index;
          return (
            <MenuItem
              disableRipple
              key={yearOption}
              onClick={() => handleYearSelect(yearOption)}
            >
              {yearOption}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ComplaintsCalendarHeader;
