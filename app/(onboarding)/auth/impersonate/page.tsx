'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getDashboardPage } from '@/app/(onboarding)/auth/data';
import { toast } from 'sonner';
import { useWalletStore } from '@/store/wallet-store';
import { useAuthStore } from '@/store/authStore';
import { saveLocalStorage } from '@/utils/local-storage';
import { saveRoleToCookie } from '@/utils/saveRole';
import { saveClientRoleToCookie } from '@/utils/saveClientRole';

const ImpersonatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleImpersonation = async () => {
      const userId = searchParams.get('user_id');
      const adminToken = searchParams.get('admin_token');

      if (!userId || !adminToken) {
        toast.error('Invalid impersonation request');
        router.push('/auth/sign-in');
        return;
      }

      try {
        // Call impersonation endpoint
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/impersonate`,
          { user_id: userId },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        if (!data.status) {
          throw new Error(data.message || 'Impersonation failed');
        }

        // Extract data from response
        const { access_token, data: userData, additional_details, wallet_pin_status, wallet_id } = data;
        const role = userData.details.role[0];
        const email = userData.details.email;
        const emailVerified = userData.details.email_verification;
        const managerId = userData.details.id;
        const appearance = additional_details?.settings?.appearance;
        const company_status = additional_details.status;

        const details = {
          user_id: additional_details?.user_id || null,
          branch: {
            branch_id: additional_details?.branch?.id || null,
            picture: additional_details?.branch?.picture || null,
          },
          company: {
            company_id: additional_details?.id || null,
            company_logo: additional_details?.company_logo || null,
            dark_logo: additional_details?.dark_logo || null,
          },
          appearance: appearance,
        };

        // Save to cookies
        Cookies.set('auth-token', access_token, {
          expires: 1, // Short-lived for security
          secure: true,
          sameSite: 'Strict',
          path: '/',
        });
        Cookies.set('is_impersonating', 'true', {
          expires: 1,
          secure: true,
          sameSite: 'Strict',
          path: '/',
        });

        // Save to Zustand store
        useAuthStore.getState().setAuthState('token', access_token);
        useAuthStore.getState().setAuthState('role', role);
        useAuthStore.getState().setAuthState('email', email);
        useAuthStore.getState().setAuthState('user_id', details?.user_id);
        useAuthStore.getState().setAuthState('additional_details', details);

        // Save to localStorage
        saveLocalStorage('user_id', managerId);

        // Save roles for authentication
        await saveRoleToCookie(role);
        await saveClientRoleToCookie(role);

        // Set wallet data
        useWalletStore.getState().setWalletStore('walletPinStatus', wallet_pin_status);
        useWalletStore.getState().setWalletStore('walletId', wallet_id);

        // Redirect based on role and email verification
        if (!emailVerified) {
          toast.warning('Please verify your email to continue');
          router.push('/auth/sign-up');
        } else if (role === 'user') {
          router.push('/setup');
        } else {
          router.push(getDashboardPage(role));
        }
      } catch (error) {
        console.error('Impersonation error:', error);
        toast.error('Failed to impersonate user');
        router.push('/auth/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    handleImpersonation();
  }, [router, searchParams]);


//   useEffect(() => {
//     const handleImpersonation = async () => {
//     //   const userId = searchParams.get('user_id');
//     //   const adminToken = searchParams.get('admin_token');

//     //   if (!userId || !adminToken) {
//     //     toast.error('Invalid impersonation request');
//     //     router.push('/auth/sign-in');
//     //     return;
//     //   }

//     //   try {
//     //     // Call impersonation endpoint
//     //     const { data } = await axios.post(
//     //       'https://admin-api.example.com/impersonate',
//     //       { user_id: userId },
//     //       { headers: { Authorization: `Bearer ${adminToken}` } }
//     //     );

//     //     if (!data.status) {
//     //       throw new Error(data.message || 'Impersonation failed');
//     //     }

//     //     // Extract data from response
//     //     const { access_token, data: userData, additional_details, wallet_pin_status, wallet_id } = data;
//     //     const role = userData.details.role[0];
//     //     const email = userData.details.email;
//     //     const emailVerified = userData.details.email_verification;
//     //     const managerId = userData.details.id;
//     //     const appearance = additional_details?.settings?.appearance;
//     //     const company_status = additional_details.status;

//     //     const details = {
//     //       user_id: additional_details?.user_id || null,
//     //       branch: {
//     //         branch_id: additional_details?.branch?.id || null,
//     //         picture: additional_details?.branch?.picture || null,
//     //       },
//     //       company: {
//     //         company_id: additional_details?.id || null,
//     //         company_logo: additional_details?.company_logo || null,
//     //         dark_logo: additional_details?.dark_logo || null,
//     //       },
//     //       appearance: appearance,
//     //     };

//     //     // Save to cookies
//     //     Cookies.set('auth-token', access_token, {
//     //       expires: 1, // Short-lived for impersonation
//     //       secure: true,
//     //       sameSite: 'Strict',
//     //       path: '/',
//     //     });
//     //     Cookies.set('is_impersonating', 'true', {
//     //       expires: 1,
//     //       secure: true,
//     //       sameSite: 'Strict',
//     //       path: '/',
//     //     });

//     //     // Save to Zustand store
//     //     useAuthStore.getState().setAuthState('token', access_token);
//     //     useAuthStore.getState().setAuthState('role', role);
//     //     useAuthStore.getState().setAuthState('email', email);
//     //     useAuthStore.getState().setAuthState('user_id', details?.user_id);
//     //     useAuthStore.getState().setAuthState('additional_details', details);
//     //     useAuthStore.getState().setAuthState('emailVerified', emailVerified);

//     //     // Save to localStorage
//     //     saveLocalStorage('user_id', managerId);

//     //     // Save roles for authentication
//     //     await saveRoleToCookie(role);
//     //     await saveClientRoleToCookie(role);

//     //     // Set wallet data
//     //     useWalletStore.getState().setWalletStore('walletPinStatus', wallet_pin_status);
//     //     useWalletStore.getState().setWalletStore('walletId', wallet_id);

//     //     // Redirect based on role and email verification
//     //     if (!emailVerified) {
//     //       toast.warning('Please verify your email to continue');
//     //       router.push('/auth/sign-up');
//     //     } else if (role === 'user') {
//     //       router.push('/setup');
//     //     } else {
//     //       router.push(getDashboardPage(role));
//     //     }
//     //   } catch (error) {
//     //     console.error('Impersonation error:', error);
//     //     toast.error('Failed to impersonate user');
//     //     router.push('/auth/sign-in');
//     //   } finally {
//     //     setIsLoading(false);
//     //   }
//     };

//     handleImpersonation();
//   }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center p-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="loader border-brand-9" role="status"></div>
          <p className="mt-4">Authenticating...</p>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default ImpersonatePage;