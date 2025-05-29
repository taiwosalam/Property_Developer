import { Button, Modal, Box } from "@mui/material";
import { useState } from "react";
import FilterButton from "@/components/FilterButton/filter-button";
import FilterModal from "@/components/Management/Landlord/filters-modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ChildModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} className="bg-transparent">
        <FilterButton noTitle className="text-black" />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <div className="w-full h-full flex items-center justify-center">
             <FilterModal isDateTrue handleFilterApply={() => {}} />
          </div>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </>
  );
}
