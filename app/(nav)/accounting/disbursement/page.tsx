"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "@/components/Form/Button/button";
import type { DataItem } from "@/components/Table/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import NewDisbursementModal from "@/components/Accounting/Disbursement/new-disbursement-modal";
import {
  accountingDisbursementOptionsWithDropdown,
  DisburseApiResponse,
  disbursementTableData,
  disbursementTableFields,
  transformDisburseData,
  TransformedDisburseItem,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import MenuItem from "@mui/material/MenuItem";
import CustomTable from "@/components/Table/table";
import TableMenu from "@/components/Table/table-menu";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";

const Disbursement = () => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TransformedDisburseItem[]>([]);

  const { data, loading, error, isNetworkError } = useFetch<DisburseApiResponse>("/disburses");

  useEffect(() => {
    if (data) {
      const transformed = transformDisburseData(data);
      setTableData(transformed);
    }
  }, [data]);


  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };


  if (loading) return <CustomLoader layout="page" pageTitle="Disbursement" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;


  return (
    <div className="custom-flex-col gap-8">
      <div className="flex items-center justify-end">
        {/* <Modal>
          <ModalTrigger asChild> */}
        <Button
          type="button"
          className="page-header-button"
          onClick={() => router.push('/accounting/disbursement/create-disbursement')}
        >
          + new disbursement
        </Button>
        {/* </ModalTrigger> */}
        {/* <ModalContent>
            <NewDisbursementModal />
          </ModalContent> */}
        {/* </Modal> */}
      </div>
      <div className="custom-flex-col gap-4">
        <FilterBar
          azFilter
          searchInputPlaceholder="Search for disbursement"
          handleFilterApply={() => { }}
          isDateTrue
          filterOptionsMenu={accountingDisbursementOptionsWithDropdown}
          hasGridListToggle={false}
          exports
          exportHref="/accounting/disbursement/export"
          pageTitle="Disbursement"
        />
        <CustomTable
          fields={disbursementTableFields}
          // data={disbursementTableData}
          data={tableData}
          tableHeadStyle={{ height: "76px" }}
          tableHeadCellSx={{ fontSize: "1rem" }}
          tableBodyCellSx={{
            fontSize: "1rem",
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
          onActionClick={(item, e) => {
            handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
          }}
        />
      </div>
      <TableMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} disableRipple>
          <Link
            href={`/accounting/disbursement/${selectedItemId}/manage-disbursement`}
            className="w-full text-left"
          >
            Manage Disbursement
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} disableRipple>
          <Link
            href={`/accounting/disbursement/${selectedItemId}/preview-disbursement`}
            className="w-full text-left"
          >
            Preview Disbursement
          </Link>
        </MenuItem>
      </TableMenu>
    </div >
  );
};

export default Disbursement;
