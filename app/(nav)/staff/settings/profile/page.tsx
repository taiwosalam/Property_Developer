'use client';

import React, { useEffect, useState } from 'react';

// Images
import { Check } from 'lucide-react';
import DangerIcon from '@/public/icons/danger.svg';
import ImageBlue from '@/public/icons/image-blue.svg';
import SignatureImage from '@/public/accounting/signature.svg';

// Imports
import { genderTypes, industryOptions, titles } from '@/data';
import Input from '@/components/Form/Input/input';
import Picture from '@/components/Picture/picture';
import Select from '@/components/Form/Select/select';
import { useImageUploader } from '@/hooks/useImageUploader';
import SettingsSection from '@/components/Settings/settings-section';
import { ProfileUpload } from '@/components/Settings/settings-components';

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from '@/components/Settings/settings-components';
import { usePersonalInfoStore } from '@/store/personal-info-store';
import {
  cleanPhoneNumber,
  objectToFormData,
} from '@/utils/checkFormDataForImageOrAvatar';
import { toast } from 'sonner';
import { AuthForm } from '@/components/Auth/auth-components';
import { FormState } from '@/app/(nav)/settings/security/data';
import TextArea from '@/components/Form/TextArea/textarea';
import PhoneNumberInput from '@/components/Form/PhoneNumberInput/phone-number-input';


const Profile = () => {
  const name = usePersonalInfoStore((state) => state.full_name);
  const title = usePersonalInfoStore((state) => state.title);
  const { preview, inputFileRef, handleImageChange } = useImageUploader();

  const [inputFields, setInputFields] = useState([
    { id: Date.now(), signature: SignatureImage },
  ]);
  const profile_picture = usePersonalInfoStore(
    (state) => state.profile_picture
  );
  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: name || '',
    title: title || '',
  });

  const setUpdateState = (fieldName: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [fieldName]: value }));
  };

  const changeImage = () => {
    inputFileRef?.current?.click();
  };

  //   const handleUpdateProfile = async (data: FormData) => {
  //     const payload = {
  //       name: data.get('name'),
  //       title: data.get('title'),
  //       picture: data.get('picture'),
  //     };

  //     try {
  //       setReqLoading(true);
  //       const res = await updateUserProfile(objectToFormData(payload));
  //       if (res && 'status' in res && res.status === 200) {
  //         // console.log(res);
  //         toast.success('Profile updated successfully');
  //         setNext(true);
  //         window.dispatchEvent(new Event('fetch-profile'));
  //       }
  //     } catch (error) {
  //       toast.error('Error updating profile');
  //     } finally {
  //       setReqLoading(false);
  //     }
  //   };

  return (
    <>
      <SettingsSection title='My profile'>
        <AuthForm
          onFormSubmit={() => {}}
          skipValidation
          returnType='form-data'
        >
          <div className='custom-flex-col gap-8'>
            <div className='custom-flex-col gap-4'>
              <SettingsSectionTitle
                title='Profile Picture'
                desc='The profile photo size should be 180 x 180 pixels with a maximum file size of 2MB.'
              />
              <div className='custom-flex-col gap-[18px]'>
                <ProfileUpload
                  preview={preview || profile_picture || ''}
                  onChange={handleImageChange}
                  inputFileRef={inputFileRef}
                  onClick={changeImage}
                />
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                  <Select
                    id='personal_title'
                    name='title'
                    options={titles}
                    label='personal title'
                    inputContainerClassName='bg-neutral-2'
                    defaultValue={title as string}
                  />
                  <Select
                    isSearchable={false}
                    id='real_estate_title'
                    label='real estate title'
                    inputContainerClassName='bg-neutral-2'
                    options={industryOptions}
                    // defaultValue={staff?.real_estate_title}
                  />
                  <Input
                    id='fullname'
                    name='name'
                    label='full name'
                    placeholder='Write Here'
                    defaultValue={name}
                  />
                  <Input
                    id='email'
                    type='email'
                    label='email'
                    disabled
                    // defaultValue={staff?.email}
                  />
                  <Select
                    id='gender'
                    label='gender'
                    isSearchable={false}
                    options={genderTypes}
                    inputContainerClassName='bg-neutral-2'
                    // defaultValue={staff?.gender}
                  />
                  <PhoneNumberInput
                    id='phone_number'
                    label='phone number'
                    required
                    // defaultValue={staff?.phone_number}
                  />
                </div>
              </div>
              <div className='flex flex-col gap-2 w-full my-4'>
                <TextArea
                  inputSpaceClassName='bg-white dark:bg-darkText-primary'
                  id='description'
                  // defaultValue={somedata?.description}
                  label='About Me'
                />
              </div>
            </div>
            <SettingsUpdateButton
              submit
              loading={reqLoading}
              //   action={()=> {}}
              next={next}
            />
          </div>
        </AuthForm>
      </SettingsSection>
    </>
  );
};

export default Profile;
