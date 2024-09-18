export const RentSectionContainer = ({
  title,
  children,
  style,
  hidebar,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hidebar?: boolean;
}) => (
  <div
    className="bg-white p-6 rounded-lg"
    style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
  >
    <h2 className="font-bold text-[#092C4C] text-xl">{title}</h2>
    <div
      className="w-full h-[2px] bg-[#C0C2C8] bg-opacity-20 my-4"
      hidden={hidebar}
    ></div>
    {children}
  </div>
);
