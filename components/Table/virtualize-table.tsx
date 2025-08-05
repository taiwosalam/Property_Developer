
// VirtualizedCustomTable.tsx
"use client";
import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
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
  Box,
} from "@mui/material";
import { ReactNode } from "react";
import { VerticalEllipsisIcon } from "@/public/icons/icons";
import useDarkMode from "@/hooks/useCheckDarkMode";

// Extended props for virtualized table
interface VirtualizedTableProps extends CustomTableProps {
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => Promise<void>;
  rowHeight?: number;
  containerHeight?: number;
  overscan?: number;
}

// Row renderer component
interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: DataItem[];
    fields: Field[];
    isDarkMode: boolean;
    evenRowColor: string;
    oddRowColor: string;
    actionButtonIcon?: ReactNode;
    onActionClick?: CustomTableProps["onActionClick"];
    handleSelect?: CustomTableProps["handleSelect"];
    isItemLoaded: (index: number) => boolean;
    isNextPageLoading: boolean;
  };
}

const renderValue = (
  data: DataItem,
  field: Field,
  index: number,
  actionButtonIcon: ReactNode,
  onActionClick?: CustomTableProps["onActionClick"]
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
          className="mx-auto bg-var(--secondary-color)"
          alt="avatar"
          sx={{
            width: field.picSize || 60,
            height: field.picSize || 60,
            backgroundColor: "var(--secondary-color)",
          }}
        />
      </div>
    ) : (
      <Avatar
        src={value}
        className="mx-auto"
        alt="avatar"
        sx={{
          width: field.picSize || 60,
          height: field.picSize || 60,
          backgroundColor: "var(--secondary-color)",
        }}
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
            onClick={onActionClick ? (e) => onActionClick(data, e) : undefined}
          >
            {actionButtonIcon || <VerticalEllipsisIcon />}
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="action"
          className="p-2 grid place-items-center mx-auto text-brand-10"
          onClick={onActionClick ? (e) => onActionClick(data, e) : undefined}
        >
          {actionButtonIcon || <VerticalEllipsisIcon />}
        </button>
      );
    default:
      return field.contentStyle ? (
        <div style={field.contentStyle}>{value ?? "-"}</div>
      ) : (
        value ?? "--- ---"
      );
  }
};

const getUniqueKey = (item: DataItem) => {
  return item._id || item.id;
};

// Loading row component
const LoadingRow: React.FC<{ fields: Field[]; style: React.CSSProperties }> = ({
  fields,
  style,
}) => (
  <div style={style} className="flex items-center">
    <TableRow className="w-full">
      {fields.map((field, fieldIndex) => (
        <TableCell
          key={`loading-${fieldIndex}`}
          sx={{
            fontFamily: "unset",
            paddingTop: "8px",
            paddingBottom: "8px",
            border: "none",
            fontWeight: 500,
            fontSize: "14px",
            textAlign: "left",
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div className="animate-pulse bg-gray-300 h-4 rounded"></div>
        </TableCell>
      ))}
    </TableRow>
  </div>
);

// Individual row component
const VirtualTableRow: React.FC<RowProps> = ({ index, style, data }) => {
  const {
    items,
    fields,
    isDarkMode,
    evenRowColor,
    oddRowColor,
    actionButtonIcon,
    onActionClick,
    handleSelect,
    isItemLoaded,
    isNextPageLoading,
  } = data;

  // Show loading row if item is not loaded
  if (!isItemLoaded(index)) {
    return <LoadingRow fields={fields} style={style} />;
  }

  const item = items[index];
  if (!item) {
    return <LoadingRow fields={fields} style={style} />;
  }

  return (
    <div style={style} className="flex items-center">
      <TableRow
        key={getUniqueKey(item)}
        onClick={handleSelect ? (e) => handleSelect(item, e) : undefined}
        className="cursor-pointer w-full"
        sx={{
          backgroundColor: index % 2 === 0 ? oddRowColor : evenRowColor,
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: isDarkMode ? "#2c2f33" : "#dbe6f3",
          },
        }}
      >
        {fields.map((field, fieldIndex) => (
          <TableCell
            key={`${getUniqueKey(item)}-${field.id}-${fieldIndex}`}
            sx={{
              fontFamily: "unset",
              paddingTop: "8px",
              paddingBottom: "8px",
              border: "none",
              fontWeight: 500,
              fontSize: "14px",
              textAlign: "left",
              maxWidth: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: isDarkMode ? "#C1C2C3" : "#050901",
              ...field.cellStyle,
              ...(field.accessor === "email" ||
              field.accessor === "link" ||
              field.accessor === "uploaded"
                ? { textTransform: "lowercase" }
                : {}),
            }}
          >
            {renderValue(item, field, index, actionButtonIcon, onActionClick)}
          </TableCell>
        ))}
      </TableRow>
    </div>
  );
};

// Main virtualized table component
const VirtualizedCustomTable: React.FC<VirtualizedTableProps> = ({
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
  onActionClick,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  rowHeight = 76,
  containerHeight = 600,
  overscan = 5,
}) => {
  const isDarkMode = useDarkMode();
  const listRef = useRef<List>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  const evenRowColor = isDarkMode ? "#3C3D37" : "#fff";
  const oddRowColor = isDarkMode ? "#020617" : "var(--brand-1)";

  // Measure header height
  useEffect(() => {
    if (headerRef.current && displayTableHead) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [displayTableHead, fields]);

  // Calculate available height for virtualized content
  const availableHeight = displayTableHead 
    ? containerHeight - headerHeight 
    : containerHeight;

  // Memoized item count
  const itemCount = useMemo(() => {
    return hasNextPage ? data.length + 1 : data.length;
  }, [data.length, hasNextPage]);

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index: number) => {
      return !!data[index];
    },
    [data]
  );

  // Load next page handler
  const handleLoadNextPage = useCallback(async () => {
    if (loadNextPage && !isNextPageLoading) {
      try {
        await loadNextPage();
      } catch (error) {
        console.error("Error loading next page:", error);
      }
    }
  }, [loadNextPage, isNextPageLoading]);

  // Row data for the virtualized list
  const rowData = useMemo(
    () => ({
      items: data,
      fields,
      isDarkMode,
      evenRowColor,
      oddRowColor,
      actionButtonIcon,
      onActionClick,
      handleSelect,
      isItemLoaded,
      isNextPageLoading,
    }),
    [
      data,
      fields,
      isDarkMode,
      evenRowColor,
      oddRowColor,
      actionButtonIcon,
      onActionClick,
      handleSelect,
      isItemLoaded,
      isNextPageLoading,
    ]
  );

  return (
    <TableContainer
      component={Paper}
      className={clsx(
        "relative custom-round-scrollbar pb-1",
        className
      )}
      sx={{ 
        boxShadow: "none",
        height: containerHeight,
        overflow: "hidden"
      }}
    >
      <Table sx={{ boxShadow: "none" }}>
        {displayTableHead && (
          <TableHead
            ref={headerRef}
            className={clsx(
              "sticky top-0 z-[2] capitalize bg-brand-9",
              tableHeadClassName
            )}
            style={tableHeadStyle}
          >
            <TableRow>
              {fields.map((field, fieldIndex) => (
                <TableCell
                  key={`${field.id}-${fieldIndex}`}
                  sx={{
                    fontFamily: "unset",
                    textAlign: "left",
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    maxHeight: "76px",
                    border: "none",
                    color: "#EFFFFF",
                    fontWeight: 500,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    ...tableHeadCellSx,
                  }}
                >
                  {field.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
      </Table>

      {/* Virtualized content */}
      <Box sx={{ height: availableHeight, overflow: "hidden" }}>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">No data to display</div>
          </div>
        ) : (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={handleLoadNextPage}
            threshold={3} // Start loading when 3 items from the end
          >
            {({ onItemsRendered, ref }) => (
              <List
                // ref={(list) => {
                //   ref(list);
                //   listRef.current = list;
                // }}
                width={100}
                height={availableHeight}
                itemCount={itemCount}
                itemSize={rowHeight}
                itemData={rowData}
                onItemsRendered={onItemsRendered}
                overscanCount={overscan}
              >
                {VirtualTableRow}
              </List>
            )}
          </InfiniteLoader>
        )}
      </Box>
    </TableContainer>
  );
};

export default VirtualizedCustomTable;

// Hook for managing virtualized table state
export const useVirtualizedTable = (initialData: DataItem[] = []) => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const appendData = useCallback((newData: DataItem[], hasMore: boolean) => {
    setData(prev => [...prev, ...newData]);
    setHasNextPage(hasMore);
  }, []);

  const resetData = useCallback((newData: DataItem[] = []) => {
    setData(newData);
    setHasNextPage(true);
  }, []);

  const loadNextPage = useCallback(async (fetchFunction: () => Promise<{data: DataItem[], hasMore: boolean}>) => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    try {
      const result = await fetchFunction();
      appendData(result.data, result.hasMore);
    } catch (error) {
      console.error('Error loading next page:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, appendData]);

  return {
    data,
    hasNextPage,
    isLoading,
    appendData,
    resetData,
    loadNextPage,
  };
};