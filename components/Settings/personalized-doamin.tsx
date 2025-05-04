"use client";

import React, { useEffect, useState } from "react";
import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import CustomTable from "../Table/table";
import { CustomTableProps, DataItem } from "../Table/types";
import TableMenu from "../Table/table-menu";
import { Box, MenuItem, Modal } from "@mui/material";
import PaymentMethod from "../Wallet/AddFunds/payment-method";
import useSubscriptionStore from "@/store/subscriptionStore";
import Input from "../Form/Input/input";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  DomainFields,
  personalized_domain,
} from "@/app/(nav)/settings/add-on/data";
import {
  ConfirmModal,
  EditModal,
  SuccessModal,
} from "@/app/(nav)/settings/add-on/components";
import Button from "@/components/Form/Button/button";
import Select from "../Form/Select/select";
import { Modal as Modal1, ModalContent, ModalTrigger } from "../Modal/modal";
import SponsorModal from "./Modals/sponsor-modal";
import { PERIOD_OPTIONS } from "./subscription-components";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const PersonalizedDomain = () => {
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
  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (!selectedPeriod) {
      setTotalAmount(0);
      return;
    }

    const periodValue = parseInt(selectedPeriod.split(" ")[0]); // Extract number from "2 months"
    const period = PERIOD_OPTIONS.find((p) => p.value === periodValue);

    if (period) {
      const baseAmount = 2000 * period.value;
      const discount = period.discount || 0;
      const discountedAmount = baseAmount - baseAmount * discount;
      setTotalAmount(discountedAmount);
    }
  }, [selectedPeriod]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };
  const [count, setCount] = useState(0);

  const transformedPersonalizedDomain = personalized_domain.data.map(
    (data) => ({
      ...data,
      status: (
        <div className="flex">
          <p className="p-2 bg-brand-1 rounded-[4px] text-brand-9">
            {data.status}
          </p>
        </div>
      ),
    })
  );

  return (
    <SettingsSection title="Personalized Domain">
      <div className="custom-flex-col gap-8 scroll-m-8">
        <div className="custom-flex-col gap-6">
          <SettingsSectionTitle desc="A personalized domain is used for forwarding one URL to another, especially if your company has a website and you want this current landing page to have the same URL as your company website. You can create a sub-domain under your website for this landing page or purchase your preferred domain name and redirect this domain to it." />
          <div className="custom-flex-col gap-10">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle
                title="Add Domain"
                desc="Cool! You're about to make domain name! make this site accessible using your own for that to work, you'll need to create a new CNAME record pointing to wp-ultimo-v2.local on your DNS manager. After you finish that step, come back to this screen and click the button below."
              />
              <CustomTable
                fields={personalized_domain.fields}
                data={transformedPersonalizedDomain}
                {...table_style_props}
                onActionClick={(item, e) => {
                  handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
                }}
              />
              <TableMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleOpen}>
                  <button type="button">Extend</button>
                </MenuItem>
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
                  <EditModal />
                </Box>
              </Modal>
            </div>
            <div className="custom-flex-col gap-8">
              <div className="flex gap-2 items-center">
                <div>
                  <div className="flex gap-3 items-center pb-8 mt-7">
                    <Select
                      id="period"
                      className="w-[300px]"
                      options={PERIOD_OPTIONS.map((option) => ({
                        value: `${option.value} ${
                          option.value === 1 ? "month" : "months"
                        }`,
                        label: `${option.label}${
                          option.discount
                            ? ` (-${(option.discount * 100).toFixed(1)}%)`
                            : ""
                        }`,
                      }))}
                      placeholder="Select subscription period..."
                      label="Period (₦2,000/month)"
                      value={selectedPeriod}
                      onChange={(value) => setSelectedPeriod(value)}
                    />

                    <div className="flex mt-7">
                      <Modal1>
                        <ModalTrigger>
                          <Button
                            variant="change"
                            size="xs_normal"
                            className="py-2 px-3"
                          >
                            Activate
                          </Button>
                        </ModalTrigger>
                        <ModalContent>
                          <SponsorModal
                            count={parseInt(selectedPeriod)}
                            cost={totalAmount / parseInt(selectedPeriod)}
                          />
                        </ModalContent>
                      </Modal1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <SettingsUpdateButton text="add domain" type="add domain" /> */}
        <div className="custom-flex-col gap-4 scroll-m-8" id="domain">
          <div className="flex justify-between">
            <h2 className="text-text-primary dark:text-white text-lg font-medium">
              Enrollment History
            </h2>
            <Link
              href="/settings/subscription/sponsors"
              className="flex items-center gap-1"
            >
              <Link
                href={"/reports/adds-on-domain"}
                className="text-text-label dark:text-darkText-1"
              >
                See all
              </Link>
              <ChevronRight color="#5A5D61" size={16} />
            </Link>
          </div>
          <CustomTable data={[]} fields={DomainFields} {...table_style_props} />
        </div>
      </div>
    </SettingsSection>
  );
};

export default PersonalizedDomain;
