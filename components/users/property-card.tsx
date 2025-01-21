import React from 'react'
import ImageSlider from '@/components/ImageSlider/image-slider'
import AutoResizingGrid from '../AutoResizingGrid/AutoResizingGrid';
import { LocationIcon } from '@/public/icons/icons';

const LandlordPropertyCard = ({
    images,
    location,
    title
}: {
    images: string[];
    location: string;
    title: string;
}) => {
  return (
      <div className='rounded-2xl relative overflow-hidden'>
        <ImageSlider
          dot
          images={images}
          className='aspect-[1.4] rounded-lg'
        />
        <div className='custom-flex-col my-4'>
          <h3 className='font-semibold text-lg'> { title } </h3>
          <p className='flex items-center gap-2'>
            <LocationIcon size={20} />
            <span> { location } </span>
          </p>
        </div>
      </div>
  );
};

export default LandlordPropertyCard;