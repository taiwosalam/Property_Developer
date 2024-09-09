import type { CustomTableProps, DataItem, Field } from "./types";
import clsx from "clsx";
import SampleLandlord from "@/public/empty/SampleLandlord.jpeg";
import { VerticalEllipsis } from "@/public/icons/icons";
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

import { useState, useRef, useEffect, ReactNode } from "react";

const renderValue = (
  data: DataItem,
  field: Field,
  index: number,
  actionButtonIcon: ReactNode
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
          src={value}
          className="mx-auto"
          alt="avatar"
          sx={{ width: 60, height: 60 }}
        />
      </div>
    ) : (
      // <Avatar
      //   src={value}
      //   className="mx-auto"
      //   alt="avatar"
      //   sx={{ width: 60, height: 60 }}
      // />
      <Avatar
        src={SampleLandlord.src}
        className="mx-auto"
        alt="avatar"
        sx={{ width: 60, height: 60 }}
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
            className="grid place-items-center mx-auto"
          >
            {actionButtonIcon || <VerticalEllipsis />}
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="action"
          className="grid place-items-center mx-auto"
        >
          {actionButtonIcon || <VerticalEllipsis />}
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
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <TableContainer
      component={Paper}
      className={clsx("relative h-[650px] custom-round-scrollbar", className)}
      sx={{ boxShadow: "none" }}
      ref={tableContainerRef}
    >
      <Table sx={{ boxShadow: "none" }}>
        {displayTableHead && (
          <TableHead
            className={clsx("sticky top-0 z-[2]", tableHeadClassName)}
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
        <TableBody>
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
                  }}
                >
                  {renderValue(x, field, index, actionButtonIcon)}
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
