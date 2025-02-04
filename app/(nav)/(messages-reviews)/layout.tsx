const MessagesReviewsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      className="w-full rounded-lg bg-white dark:bg-black"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex h-[70vh]">{children}</div>
    </div>
  );
};

export default MessagesReviewsLayout;