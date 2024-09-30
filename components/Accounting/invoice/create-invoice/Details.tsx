const Details = () => {
  return (
    <div
      className="rounded-[8px] bg-white px-4 py-6 space-y-[10px]"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h1 className="font-bold text-xl text-[#092C4C]">Details</h1>
      <div className="h-[2px] w-3/4 bg-[#C0C2C8] bg-opacity-20" />
      <div className="w-full md:w-3/4 flex items-center flex-wrap space-x-10 text-[16px] font-normal text-black">
        <div className="flex items-center space-x-10">
          <p className="text-[#747474]">Property Id</p>
          <p>1234567894</p>
        </div>
        <div className="flex items-center space-x-10">
          <p className="text-[#747474]">Property Name</p>
          <p>Olayomi Cottage</p>
        </div>
        <div className="flex items-center space-x-10">
          <p className="text-[#747474]">Account Officer</p>
          <p>Mr Taiwo Salam</p>
        </div>
      </div>
    </div>
  );
};

export default Details;
