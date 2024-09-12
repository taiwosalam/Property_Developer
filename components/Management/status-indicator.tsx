const StatusIndicator = ({ statusTitle }: { statusTitle: string }) => {
  let backgroundColor;
  switch (statusTitle) {
    case "vacant":
      backgroundColor = "#FFBB53";
      break;
    case "occupied":
      backgroundColor = "#01BA4C";
      break;
    case "active":
      backgroundColor = "#0033C4";
      break;
    case "expired":
      backgroundColor = "#E9212E";
      break;
    case "relocate":
      backgroundColor = "#620E13";
      break;
    default:
      backgroundColor = "#000";
      break;
  }
  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-5 h-5 rounded-full"
        style={{
          backgroundColor: backgroundColor,
        }}
      ></div>
      <div className="capitalize text-text-label font-bold text-xs">
        {statusTitle}
      </div>
    </div>
  );
};

export default StatusIndicator;
