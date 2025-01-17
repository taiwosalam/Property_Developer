'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';

// Images
import { UploadImageIcon } from '@/public/icons/icons';
import Transparent from '@/public/empty/transparent.png';
import WebsiteTemplate1 from '@/public/website template/template-1.svg';
import WebsiteTemplate2 from '@/public/website template/template-2.svg';
import WebsiteTemplate3 from '@/public/website template/template-3.svg';

// Imports
import { industryOptions } from '@/data';
import { getAllStates, getLocalGovernments, getCities } from '@/utils/states';
import Input from '@/components/Form/Input/input';
import Button from '@/components/Form/Button/button';
import Select from '@/components/Form/Select/select';
import { useImageUploader } from '@/hooks/useImageUploader';
import SettingsSection from '@/components/Settings/settings-section';

import {
  CustomColorPicker,
  SettingsColorScheme,
  SettingsSectionTitle,
  SettingsUpdateButton,
  WebsiteColorSchemes,
  SettingsVerifiedBadge,
  SettingsOthersCheckBox,
  ThemeCard,
} from '@/components/Settings/settings-components';

import TextArea from '@/components/Form/TextArea/textarea';
import { website_color_schemes } from '@/components/Settings/data';
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


const Profile = () => {
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const company_id = usePersonalInfoStore((state) => state.company_id);

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

  const [modalOpen, setModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#ffffff');
  const { preview, handleImageChange } = useImageUploader({
    placeholder: Transparent,
  });

  const [socialInputs, setSocialInputs] = useState({
    instagram: companyData.instagram || 'https://instagram.com/',
    facebook: companyData.facebook || 'https://facebook.com/',
    twitter: companyData.x || 'https://x.com/',
    linkedin: companyData.linkedin || 'https://www.linkedin.com/company/',
    tiktok: companyData.tiktok || 'https://tiktok.com/',
    youtube: companyData.youtube || 'https://www.youtube.com/@',
  });

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleSocialInputChange = (platform: string, value: string) => {
    setSocialInputs((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelect = (type: string, value: string) => {
    setSelectedTemplate(value);
  };

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
  };

  const googleFonts = useGoogleFonts();

  const handleFontSelect = (fontName: string) => {
    setSelectedFont(fontName);
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      '+'
    )}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const [uploadingUtility, setUploadingUtility] = useState(false);
  const [uploadingMembership, setUploadingMembership] = useState(false);

  const handleUploadUtility = (file: File | null) => {
    console.log(file);
    if (file) {
      setUploadingUtility(true);
    } else {
      setUploadingUtility(false);
    }
  };

  const handleUploadMembership = (file: File | null) => {
    console.log(file);
    if (file) {
      setUploadingMembership(true);
    } else {
      setUploadingMembership(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (isNetworkError) return <NetworkError />;

  //  if (error)
  //    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <>
      <SettingsSection title='Branch Pofile'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          <Input
            id='branch_name'
            label='Branch name'
            placeholder='Taiwo Salam & Co.'
            // value={socialInputs.instagram}
          />
          <Input
            id='id'
            label='ID'
            placeholder='12345678'
          />
          <Input
            id='lga'
            label='Local Government'
            placeholder='Akinyele LG'
          />
          <Input
            id='linkedin'
            label='linkedIn'
            placeholder='username'
            // value={socialInputs.linkedin}
            // onChange={(value) => handleSocialInputChange('linkedin', value)}
          />
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
      <SettingsSection title='about branch'>
        <div className='custom-flex-col gap-8'>
          <TextArea
            id='about_branch'
            label=''
          />
          <div className="flex w-full">
          <Input
            id='lga'
            label='Local Government'
            placeholder='Akinyele LG'
            inputClassName='w-full'
            className='w-1/4'
          />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Profile;
