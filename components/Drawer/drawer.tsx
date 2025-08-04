import { useDrawerStore } from "@/store/drawerStore";
import { Drawer } from "@mui/material";
import SettingsLegalDrawer from "../Settings/Modals/settings-legal-drawer";

export const DrawerComponent = () => {
  const { isDrawerOpen, closeDrawer, selectedLegalOption } = useDrawerStore();
  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={closeDrawer}
      classes={{ paper: "custom-round-scrollbar" }}
      sx={{
        "& .MuiPaper-root": {
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          overflow: "auto",
          height: "500px",
        },
        zIndex: 1,
      }}
    >
      <SettingsLegalDrawer
        onClose={closeDrawer}
        noCheckbox={true}
        selectedLegalOption={selectedLegalOption}
      />
    </Drawer>
  );
};
