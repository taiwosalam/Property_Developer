import PropertyPreview from '@/components/Management/Properties/property-preview';
import { units } from '../data';

const LandlordPropertyPreviewPage = ({
  params,
}: {
  params: { type: 'rental' | 'facility' };
}) => {
  // TODO: Get the property info from the database
  return (
    <PropertyPreview
      propertyType='rental'
      images={[
        '/empty/SampleProperty.jpeg',
        '/empty/SampleProperty2.jpeg',
        '/empty/SampleProperty3.jpeg',
        '/empty/SampleProperty4.png',
        '/empty/SampleProperty5.jpg',
      ]}
      address='123 Main St'
      total_income={1000000}
      total_returns={1000000}
      total_units={1}
      video_link='https://'
      property_name='Property 1'
      category='facility'
      currency='naira'
      state='Lagos'
      local_government='Ikeja'
      isRental={true}
      id='22'
      landlord
      units={units}
    />
  );
};

export default LandlordPropertyPreviewPage;