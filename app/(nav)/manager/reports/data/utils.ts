
export const hasActiveFilters = (filters: any) => {
    return (
      (filters.options && filters.options.length > 0) ||
      (filters.menuOptions && Object.keys(filters.menuOptions).length > 0) ||
      filters.startDate ||
      filters.endDate
    );
  };