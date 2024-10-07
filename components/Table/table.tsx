"use client";
import type { CustomTableProps, DataItem, Field } from "./types";
import clsx from "clsx";
import { empty } from "@/app/config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";

import { ReactNode } from "react";
import { VerticalEllipsisIcon } from "@/public/icons/icons";

const renderValue = (
  data: DataItem,
  field: Field,
  index: number,
  actionButtonIcon: ReactNode,
  onActionClick?: (data: DataItem) => void
) => {
  let value = data[field.accessor];
  if (field.accessor === "S/N") {
    return field.contentStyle ? (
      <div style={field.contentStyle}>{String(index + 1).padStart(2, "0")}</div>
    ) : (
      String(index + 1).padStart(2, "0")
    );
  }
  if (field.isImage) {
    return field.contentStyle ? (
      <div style={field.contentStyle}>
        <Avatar
          src={value || empty}
          className="mx-auto"
          alt="avatar"
          sx={{ width: field.picSize || 60, height: field.picSize || 60 }}
        />
      </div>
    ) : (
      <Avatar
        src={value}
        className="mx-auto"
        alt="avatar"
        sx={{ width: field.picSize || 60, height: field.picSize || 60 }}
      />
    );
  }
  switch (field.accessor) {
    case "action":
      return field.contentStyle ? (
        <div style={field.contentStyle}>
          <button
            type="button"
            aria-label="action"
            className="p-2 grid place-items-center mx-auto text-brand-10"
            onClick={onActionClick ? () => onActionClick(data) : undefined}
          >
            {actionButtonIcon || <VerticalEllipsisIcon />}
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="action"
          className="p-2 grid place-items-center mx-auto text-brand-10"
          onClick={onActionClick ? () => onActionClick(data) : undefined}
        >
          {actionButtonIcon || <VerticalEllipsisIcon />}
        </button>
      );
    default:
      return field.contentStyle ? (
        <div style={field.contentStyle}>{value ?? "-"}</div>
      ) : (
        value ?? "-"
      );
  }
};

const getUniqueKey = (item: DataItem) => {
  return item.id || item._id;
};

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  fields,
  displayTableHead = true,
  className,
  handleSelect,
  actionButtonIcon,
  tableHeadClassName,
  tableHeadStyle,
  tableHeadCellSx,
  tableBodyCellSx,
  evenRowColor = "#fff",
  oddRowColor = "#fff",
  onActionClick,
}) => {
  return (
    <TableContainer
      component={Paper}
      className={clsx(
        "relative max-h-[650px] custom-round-scrollbar",
        className
      )}
      sx={{ boxShadow: "none" }}
    >
      <Table sx={{ boxShadow: "none" }}>
        {displayTableHead && (
          <TableHead
            className={clsx(
              "sticky top-0 z-[2] capitalize",
              tableHeadClassName
            )}
            style={tableHeadStyle}
          >
            <TableRow>
              {fields.map((field) => (
                <TableCell
                  key={field.id}
                  sx={{
                    fontFamily: "unset",
                    textAlign: "center",
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    maxHeight: "76px",
                    ...tableHeadCellSx,
                  }}
                >
                  {field.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody className="capitalize">
          {data.map((x, index) => (
            <TableRow
              key={getUniqueKey(x)}
              onClick={handleSelect ? () => handleSelect(x) : undefined}
              className="cursor-pointer"
              sx={{
                backgroundColor: index % 2 === 0 ? oddRowColor : evenRowColor,
                maxHeight: "76px",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#dbe6f3",
                },
              }}
            >
              {fields.map((field) => (
                <TableCell
                  key={field.id}
                  sx={{
                    fontFamily: "unset",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    ...tableBodyCellSx,
                    ...field.cellStyle,
                    ...(field.accessor === "email"
                      ? { textTransform: "lowercase" }
                      : {}), // Apply unset for email only
                  }}
                >
                  {renderValue(
                    x,
                    field,
                    index,
                    actionButtonIcon,
                    onActionClick
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
