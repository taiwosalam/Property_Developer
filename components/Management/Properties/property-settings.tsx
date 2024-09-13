const PropertySettings = () => {
  return (
    <div
      className="py-6 px-4 rounded-lg bg-white"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Property Settings
      </h4>
      <hr className="my-2.5" />

      <div className="overflow-x-auto max-w-full flex-grow">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
          <div>
            <p className="text-[#747474]">Agency Fee</p>
            <p className="text-black">10%</p>
          </div>
          <div>
            <p className="text-[#747474]">Period</p>
            <p className="text-black">Annually</p>
          </div>
          <div>
            <p className="text-[#747474]">Charge</p>
            <p className="text-black">Rent</p>
          </div>
          <div>
            <p className="text-[#747474]">Book Visitors</p>
            <p className="text-black">Yes</p>
          </div>
          <div>
            <p className="text-[#747474]">VAT</p>
            <p className="text-black">Yes</p>
          </div>
          <div>
            <p className="text-[#747474]">Caution Deposit</p>
            <p>Escrow it</p>
          </div>
          <div>
            <p className="text-[#747474]">Group Chat</p>
            <p>Yes</p>
          </div>
          <div>
            <p className="text-[#747474]">Rent Penalty</p>
            <p>Yes</p>
          </div>
          <div>
            <p className="text-[#747474]">Request Call back</p>
            <p>Yes</p>
          </div>
          <div>
            <p className="text-[#747474]">Currency</p>
            <p>N</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySettings;
