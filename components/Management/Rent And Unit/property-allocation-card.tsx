import React, { useState } from 'react';
import { Camera, Video } from 'lucide-react';
import Image from 'next/image';

// TypeScript interfaces
export interface PropertyAllocation {
  id: string;
  unitDetails: string;
  unitSubType: string;
  unitPreference: string;
  unitPrice: string;
  unitType: string;
  firstDeposit: string;
  propertyImages: string[];
  hasVideo: boolean;
  managedBy: string;
  salesType: 'Installment Sales' | 'Outright Sales' | 'Rental';
  currency: string;
}

interface IAllocationCardProps {
  property: PropertyAllocation;
  className?: string;
}

// Mock components to match your existing code structure
const SectionSeparator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 dark:bg-gray-600 ${className}`} />
);

const CameraIcon = () => <Camera size={12} />;

const AllocationCard: React.FC<IAllocationCardProps> = ({
  property,
  className = ''
}) => {
  const [screenModal, setScreenModal] = useState(false);

  const getSalesTypeStyle = (salesType: string) => {
    switch (salesType) {
      case 'Installment Sales':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/25 dark:text-blue-300';
      case 'Outright Sales':
        return 'bg-green-100 text-green-800 dark:bg-green-900/25 dark:text-green-300';
      case 'Rental':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/25 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/25 dark:text-gray-300';
    }
  };

  return (
    <>
      <div
        className={`p-6 rounded-2xl bg-white dark:bg-darkText-primary ${className}`}
        style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
      >
        {/* Mock PopupImageModal - in real implementation, use your existing modal */}
        {screenModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setScreenModal(false)}
          >
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
              <h3 className="text-lg font-semibold mb-4">Property Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.propertyImages.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                    width={1000}
                    height={1000}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-between items-center overflow-y-auto custom-round-scrollbar pb-2">
          <div className="min-w-[400px] flex-1 text-sm md:text-base grid grid-cols-3 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
            
            <div>
              <p className="text-[#747474] dark:text-white">Unit Details</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {property.unitDetails}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Unit Sub Type</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {property.unitSubType}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Unit Preference</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {property.unitPreference}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Unit Price</p>
              <p className="text-black dark:text-darkText-1 font-semibold">
                {property.currency}{property.unitPrice}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Unit Type</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {property.unitType}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">First Deposit</p>
              <p className="text-black dark:text-darkText-1 font-semibold">
                {property.currency}{property.firstDeposit}
              </p>
            </div>
          </div>

          {/* Image */}
          <div
            role="button"
            className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
            onClick={() => setScreenModal(true)}
          >
            {property.propertyImages.length > 1 && (
              <div className="absolute z-[1] left-[50%] transform -translate-x-1/2 bottom-3 bg-white bg-opacity-90 px-3 rounded py-1 flex items-center gap-1">
                <CameraIcon />
                <p className="text-black font-medium text-[10px]">
                  +{property.propertyImages.length - 1}
                </p>
              </div>
            )}
            
            {property.hasVideo && (
              <div className="absolute z-[1] right-3 bottom-3 bg-white bg-opacity-70 rounded py-1 px-2">
                <Video size={15} className="text-black font-medium text-[10px]" />
              </div>
            )}

            <Image
              src={property.propertyImages[0] || "/api/placeholder/168/168"}
              alt="Property"
              className="w-full h-full object-cover object-center"
              width={1000}
              height={1000}
            />
          </div>
        </div>

        <SectionSeparator className="my-4 h-[2px]" />
        
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-3">
            <button
              className={`py-1 capitalize rounded-xl px-4 h-7 text-sm mt-1 font-medium ${getSalesTypeStyle(property.salesType)}`}
            >
              {property.salesType}
            </button>
            
            <p className="text-[#747474] dark:text-gray-400 font-mono text-base">
              ID: {property.id}
            </p>
          </div>

          <p className="text-[#343434] dark:text-white font-semibold mt-3 sm:mt-0 text-lg capitalize">
            <span>{"(His Grace Hotel and Suites) "}</span>Managed By: {property.managedBy}
          </p>
        </div>
      </div>
    </>
  );
};


export default AllocationCard;