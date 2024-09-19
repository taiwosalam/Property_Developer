export const sanitizeBreakpoints = (breakpoints: number[] = []) => {
  // Remove existing 0 and 100 from the array
  const filteredBreakpoints = breakpoints.filter(
    (bp) => bp !== 0 && bp !== 100
  );

  // Add 0 to the beginning and 100 to the end
  return [0, ...filteredBreakpoints, 100];
};
