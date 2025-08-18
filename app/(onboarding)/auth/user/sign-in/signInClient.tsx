'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Form/Input/input';
import Button from '@/components/Form/Button/button';
import Checkbox from '@/components/Form/Checkbox/checkbox';
import {
  AuthAction,
  AuthForm,
  AuthHeading,
} from '@/components/Auth/auth-components';
import { getDashboardPage, login } from '@/app/(onboarding)/auth/data';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/authStore';
import { useRole } from '@/hooks/roleContext';
import { getLocalStorage } from '@/utils/local-storage';
import { empty } from '@/app/config';
import { usePersonalInfoStore } from '@/store/personal-info-store';

const SignIn = () => {
  const router = useRouter();
  const { role, setRole } = useRole();
  const [isLoading, setIsLoading] = useState(false);
  const loggedInUserDetails = getLocalStorage('additional_details');
  const { company: loggedUserCompany, branch: loggedUserBranch } =
    loggedInUserDetails || {};
  const company_logo = usePersonalInfoStore(
    (state) => state.company_logo || loggedUserCompany?.company_logo
  );

  const logo = company_logo || null;

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    const a = await login(formData);
    if (a === 'redirect to verify email') {
      router.push('/auth/sign-up');
    } else if (a === 'redirect to dashboard') {
      // Wait until the `role` is set in Zustand before redirecting
      const interval = setInterval(() => {
        const currentRole = useAuthStore.getState().role;
        if (currentRole) {
          clearInterval(interval);
          router.push(getDashboardPage(currentRole));
        }
      }, 50);
    } else if (a === 'redirect to setup') {
      router.push('/setup');
    }
    setIsLoading(false);
  };

  return (
    <AuthForm
      onFormSubmit={handleSubmit}
      skipValidation
     className='custom-flex-col mid-gap pt-6'
    >
      <AuthHeading
        title='welcome Back'
        logo={logo}
      >
        Please provide the following information to log in to your account.
      </AuthHeading>
      <div className='custom-flex-col gap-6'>
        <Input
          id='username'
          type='email'
          label='email'
          placeholder='Enter your email address'
          requiredNoStar
        />
        <div className='custom-flex-col gap-4'>
          <Input
            id='password'
            type='password'
            label='password'
            placeholder='Enter your password'
            requiredNoStar
            minLength={8}
          />
          <div className='flex items-center justify-between'>
            <Checkbox
            // checked={rememberMe}
            // onChange={() => setRememberMe(!rememberMe)}
            sm
            >
              remember me
            </Checkbox>
            <Link
              href='/auth/forgot-password'
              className='custom-primary-color text-sm font-medium'
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <Button
          type='submit'
          disabled={isLoading}
          size="base_bold"
          variant="default"
          className="py-xs px-lg mt-2"
        >
          {isLoading ? 'signing in...' : 'sign in'}
        </Button>
      </div>
    </AuthForm>
  );
};

export default SignIn;
