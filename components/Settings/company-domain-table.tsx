import { personalized_domain } from "@/app/(nav)/settings/add-on/data";
import SettingsSection from "./settings-section";
import CustomTable from "../Table/table";
import { SectionTitle } from "../Section/section-components";
import { useState } from "react";

import { DataItem } from "../Table/types";
import TableMenu from "../Table/table-menu";
import { Box, MenuItem, Modal } from "@mui/material";
//import Modal from "@mui/material";
import useSubscriptionStore from "@/store/subscriptionStore";
import {
  ConfirmModal,
  EditModal,
  SuccessModal,
} from "@/app/(nav)/settings/add-on/components";
import PaymentMethod from "../Wallet/AddFunds/payment-method";

interface DomainTable {
  data: {
    status: boolean;
    ssl: string;
    domain: string;
  }[];
}

export const CompanySettingsDomainTable = ({ data }: DomainTable) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const {
    openSuccessModal,
    openSuccess,
    openWarningModal,
    openWarning,
    closeWarning,
    closeSuccess,
    openEditModal,
    openEdit,
    closeEdit,
  } = useSubscriptionStore();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  //const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open, setOpen] = useState(false);

  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  return (
    <>
      {data && data?.length > 0 && (
        <div className="py-6">
          <SectionTitle>
            <div className="py-4">
              <h2 className="text-base">Custom Domain</h2>
              <p className="py-2 text-sm text-slate-600">
                Manage a custom domain of your choice to showcase your company
                profile and promote your property listings portfolio to a global
                audience.
              </p>
            </div>
          </SectionTitle>
          <div>
            <CustomTable
              tableBodyCellSx={{
                textTransform: "lowercase",
              }}
              fields={personalized_domain.fields}
              data={data}
              onActionClick={(item, e) => {
                handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
              }}
              className="lowercase"
            />
            <TableMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={openWarning}>
                <button type="button">Delete</button>
              </MenuItem>
              <MenuItem onClick={openEdit}>
                <button type="button">Edit</button>
              </MenuItem>
            </TableMenu>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <PaymentMethod
                  title="Personalized Domain Price"
                  price={2000}
                  counter={true}
                />
              </Box>
            </Modal>
            <Modal
              open={openWarningModal}
              onClose={closeWarning}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <ConfirmModal />
              </Box>
            </Modal>
            <Modal
              open={openSuccessModal}
              onClose={closeSuccess}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <SuccessModal />
              </Box>
            </Modal>
            <Modal
              open={openEditModal}
              onClose={closeEdit}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <EditModal data={data} />
              </Box>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};
