import AutoResizingGrid from '@/components/AutoResizingGrid/AutoResizingGrid';
import ManagementStatistcsCard from '@/components/Management/ManagementStatistcsCard';
import LandlordPropertyCard from '@/components/users/property-card';
import React from 'react';
import { properties } from './data';


const Landlord = () => {
  return (
    <div className='space-y-8'>
      <div className='page-header-container'>
        <div className='hidden md:flex flex-wrap gap-5'>
          <ManagementStatistcsCard
            title='Total Property'
            newData={35}
            total={657}
            className='w-[260px]'
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title='Toatl Units'
            newData={35}
            total={657}
            className='w-[260px]'
            colorScheme={2}
          />
        </div>
      </div>
      <AutoResizingGrid minWidth={315}>
        {properties.map((p) => (
          <LandlordPropertyCard
            key={p.id}
            {...p}
          />
        ))}
      </AutoResizingGrid>
    </div>
  );
};

export default Landlord;
