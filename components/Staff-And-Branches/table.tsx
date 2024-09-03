import type { CustomTableProps, DataItem, Field } from "./types";
import clsx from "clsx";
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
import { ReactNode } from "react";

const renderValue = (
  data: DataItem,
  field: Field,
  index: number,
  actionButtonIcon: ReactNode
) => {
  let value = data[field.accessor];
  if (field.accessor === "S/N") {
    return field.contentStyle ? (
      <div style={field.contentStyle}>{index + 1}</div>
    ) : (
      index + 1
    );
  }
  if (field.isImage) {
    return field.contentStyle ? (
      <div style={field.contentStyle}>
        <Avatar src={value} className="mx-auto" alt="avatar" />
      </div>
    ) : (
      <Avatar src={value} className="mx-auto" alt="avatar" />
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
  return (
    <TableContainer
      component={Paper}
      className={clsx("max-h-[650px] overflow-y-auto mb-4", className)}
      sx={{ boxShadow: "none" }}
    >
      <Table sx={{ boxShadow: "none" }}>
        <TableHead
          className={clsx("sticky top-0 z-[2]", tableHeadClassName)}
          style={tableHeadStyle} // Apply custom inline styles
        >
          <TableRow>
            {fields.map((field) => (
              <TableCell
                key={field.id}
                sx={{
                  textAlign: "center",
                  ...tableHeadCellSx,
                }}
              >
                {field.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((x, index) => (
            <TableRow
              key={getUniqueKey(x)}
              onClick={handleSelect ? () => handleSelect(x) : undefined}
              className={clsx(handleSelect && "cursor-pointer")}
              sx={{
                backgroundColor: index % 2 === 0 ? evenRowColor : oddRowColor,
              }}
            >
              {fields.map((field) => (
                <TableCell
                  key={field.id}
                  sx={{
                    textAlign: "center",
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
