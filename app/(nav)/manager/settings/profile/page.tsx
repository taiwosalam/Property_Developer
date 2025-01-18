'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';

// Images
import { DeleteIconOrange, PersonIcon, UploadImageIcon } from '@/public/icons/icons';
import CameraCircle from '@/public/icons/camera-circle.svg';

// Imports
import { getAllStates, getLocalGovernments, getCities } from '@/utils/states';
import Input from '@/components/Form/Input/input';
import Button from '@/components/Form/Button/button';
import Select from '@/components/Form/Select/select';
import { useImageUploader } from '@/hooks/useImageUploader';
import SettingsSection from '@/components/Settings/settings-section';

import {
  SettingsUpdateButton,
} from '@/components/Settings/settings-components';
import TextArea from '@/components/Form/TextArea/textarea';
import { ModalContent } from '@/components/Modal/modal';
import { ModalTrigger } from '@/components/Modal/modal';
import { Modal } from '@/components/Modal/modal';
import { useThemeStoreSelectors } from '@/store/themeStore';
import { rgbToHex } from '@/utils/rgbaToHex';
import Link from 'next/link';
import DocumentCheckbox from '@/components/Documents/DocumentCheckbox/document-checkbox';
import DateInput from '@/components/Form/DateInput/date-input';
import FileInput from '@/components/Form/FileInput/file-input';
import CompanyMobileNumber from '@/components/Setup/company-mobile-number';
import CompanyLogo from './company-logo';
import CopyText from '@/components/CopyText/copy-text';
import useGoogleFonts from '@/hooks/useFonts';
import Picture from '@/components/Picture/picture';
import useFetch from '@/hooks/useFetch';
import useRefetchOnEvent from '@/hooks/useRefetchOnEvent';
import {
  companyData,
  CompanyDataApiResponse,
  initialPageData,
  ProfileSettingsApiResponse,
  ProfileSettingsPageState,
  transformProfileApiResponse,
  userData,
} from './data';
import NetworkError from '@/components/Error/NetworkError';
import { usePersonalInfoStore } from '@/store/personal-info-store';
import useBranchStore from '@/store/branch-store';
import LandlordTenantModalPreset from '@/components/Management/landlord-tenant-modal-preset';
import Avatars from '@/components/Avatars/avatars';
import ManagerProfile from '@/components/Settings/settingsBranchManager';

const Profile = () => {
  const company_id = usePersonalInfoStore((state) => state.company_id);

    const {
      preview,
      handleImageChange: originalHandleImageChange,
      inputFileRef,
      clearSelection: clearImageSelection,
      setPreview,
    } = useImageUploader({
      placeholder: CameraCircle,
    });

    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');

    const handleAvatarSelection = (avatarUrl: string) => {
      clearImageSelection();
      setSelectedAvatar(avatarUrl);
      setAvatarModalOpen(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedAvatar('');
      originalHandleImageChange(e);
    };

  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

  // console.log("company id", company_id)
  const [address, setAddress] = useState({
    state: '',
    lga: '',
    city: '',
  });
  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'state' && { lga: '', city: '' }),
      ...(key === 'lga' && { city: '' }),
    }));
  };

  const [state, setState] = useState<ProfileSettingsPageState>(initialPageData);

  const { verifications, companyData, directorsData } = state;

  // FETCH API DATA
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch(`/companies/${company_id}`);
  useRefetchOnEvent('refetchProfile', () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      // console.log(apiData);
      const transformedData: ProfileSettingsPageState =
        transformProfileApiResponse(apiData as CompanyDataApiResponse);
      setState(transformedData);
    }
  }, [apiData]);

  return (
    <>
      <SettingsSection title='Branch Pofile'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          <Input
            id='branch_name'
            label='branch title'
            placeholder='Write Here'
            inputClassName='bg-white'
            // defaultValue={somedata?.branch_name}
          />
          <Select
            options={getAllStates()}
            id='state'
            label='state'
            value={address.state}
            hiddenInputClassName='setup-f'
            defaultValue={state.companyData.state}
            onChange={(value) => handleAddressChange('state', value)} // Update handler
            required
          />
          <Select
            options={getLocalGovernments(address.state)}
            id='local_government'
            label='local government'
            hiddenInputClassName='setup-f'
            onChange={(value) => handleAddressChange('lga', value)} // Update handler
            value={address.lga} // Controlled value
            required
            defaultValue={state.companyData.local_government}
          />

          <Select
            options={getCities(address.state, address.lga)}
            id='city'
            label='City / Area'
            allowCustom={true}
            hiddenInputClassName='setup-f'
            onChange={(value) => handleAddressChange('city', value)} // Update handler
            value={address.city} // Controlled value
            required
            defaultValue={state.companyData.city}
          />

          <Input
            id='branch_address'
            label='Branch Full Address'
            placeholder='Enter Address'
            inputClassName='bg-white'
            // defaultValue={somedata?.address}
          />
        </div>
        <div className='flex flex-col gap-2 w-full my-4'>
          <TextArea
            inputSpaceClassName='bg-white dark:bg-darkText-primary'
            id='branch_description'
            // defaultValue={somedata?.description}
            label='About Branch'
          />
        </div>
        <div className='custom-flex-col gap-3'>
          <p className='text-black dark:text-white text-base font-normal'>
            Upload Branch picture or choose from options.
          </p>
          <div className='flex gap-3 items-center'>
            <label
              htmlFor='picture'
              className='cursor-pointer relative'
            >
              <Picture
                src={preview}
                alt='Camera'
                size={40}
                rounded
              />
              {preview && preview !== CameraCircle && (
                <div
                  role='button'
                  aria-label='remove image'
                  className='absolute top-0 right-0'
                  onClick={(e) => {
                    e.preventDefault();
                    clearImageSelection();
                  }}
                >
                  <DeleteIconOrange size={20} />
                </div>
              )}
              <input
                type='file'
                id='picture'
                name='picture'
                accept='image/*'
                className='hidden pointer-events-none'
                onChange={handleImageChange}
                ref={inputFileRef}
              />
            </label>
            <Modal
              state={{ isOpen: avatarModalOpen, setIsOpen: setAvatarModalOpen }}
            >
              <ModalTrigger
                className='bg-[rgba(42,42,42,0.63)] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white relative'
                aria-label='choose avatar'
              >
                {selectedAvatar ? (
                  <>
                    <Image
                      src={selectedAvatar}
                      alt='selected avatar'
                      width={40}
                      height={40}
                      className='object-cover object-center w-[40px] h-[40px] rounded-full bg-brand-9'
                    />
                    <div
                      role='button'
                      aria-label='remove avatar'
                      className='absolute top-0 right-0'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAvatar('');
                      }}
                    >
                      <DeleteIconOrange size={20} />
                    </div>
                  </>
                ) : (
                  <PersonIcon size={18} />
                )}
              </ModalTrigger>
              <ModalContent>
                <LandlordTenantModalPreset heading='Choose Avatar'>
                  <Avatars
                    branch
                    onClick={handleAvatarSelection}
                  />
                </LandlordTenantModalPreset>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
      <ManagerProfile />
    </>
  );
};

export default Profile;
