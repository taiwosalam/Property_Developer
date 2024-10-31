import Menu, { MenuProps } from "@mui/material/Menu";
import useDarkMode from "@/hooks/useCheckDarkMode";

interface TableMenuProps extends MenuProps {}

const TableMenu: React.FC<TableMenuProps> = (props) => {
  const isDarkMode = useDarkMode();
  return (
    <Menu
      {...props}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: 250,
            backgroundColor: isDarkMode ? "#1C1C1C" : "#FFFFFF",
            "& .MuiMenuItem-root": {
              padding: "12px 26px",
              boxShadow: "none",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "1rem",
              textTransform: "capitalize",
              color: isDarkMode ? "#E5E5E5" : "#3F4247",
            },
          },
        },
      }}
    />
  );
};

export default TableMenu;
