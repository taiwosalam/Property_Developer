// SESSION IMPORT
import type { AuthSliderContent } from '@/components/Auth/AuthSlider/types';
import { toast } from 'sonner';
import axios from 'axios';
import api, { handleAxiosError } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/wallet-store';
import { InputData } from '@/utils/checkFormDataForImageOrAvatar';
import Cookies from 'js-cookie';

import {
  manager_nav_items,
  nav_items,
  account_nav_items,
  tabs,
  accountant_search_tabs,
  staff_nav_items,
  staff_search_tabs,
  user_nav_items,
} from '@/components/Nav/data';
import {
  manager_settings_link_tabs,
  settings_link_tabs,
  staff_settings_link_tabs,
} from '@/components/Settings/data';
import {
  create_new_items,
  manager_create_new_items,
  accountant_create_new_items,
  staff_create_new_items,
} from '@/components/Nav/nav-create-new-items';
import {
  manager_profile_actions,
  profile_actions,
  account_profile_actions,
  staff_profile_actions,
  user_profile_actions,
} from '@/components/Nav/options';
import { saveCompanyStatusToCookie, saveRoleToCookie } from '@/utils/saveRole';
import { saveMiddlewareRoleToCookie } from '@/utils/setMiddlewareRole';
import { saveClientRoleToCookie } from '@/utils/saveClientRole';
import { saveLocalStorage } from '@/utils/local-storage';

export const getDashboardPage = (role: string | null) => {
  switch (role) {
    case 'director':
      return '/dashboard';
    case 'tenant':
      return '/user/dashboard';
    case 'landlord':
      return '/user/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'account':
      return '/accountant/dashboard';
    case 'staff':
      return '/staff/dashboard';
    default:
      return '/unauthorized';
  }
};

export const getNavs = (role: string | null) => {
  switch (role) {
    case 'director':
      return nav_items;
    case 'tenant':
      return user_nav_items;
    case 'landlord':
      return user_nav_items;
    case 'account':
      return account_nav_items;
    case 'staff':
      return staff_nav_items;
    case 'manager':
      return manager_nav_items;
    default:
      return null;
  }
};

export const getGlobalSearchTabs = (role: string | null) => {
  switch (role) {
    case 'director':
      return tabs;
    case 'staff':
      return staff_search_tabs;
    case 'account':
      return accountant_search_tabs;
    case 'manager':
      return tabs;
    case 'landlord':
      return tabs;
    default:
      return null;
  }
};

export const getNavCreateItems = (role: string | null) => {
  switch (role) {
    case 'director':
      return create_new_items;
    case 'landlord':
      return create_new_items;
    case 'staff':
      return staff_create_new_items;
    case 'account':
      return accountant_create_new_items;
    case 'manager':
      return manager_create_new_items;
    default:
      return null;
  }
};

export const getProfileDropdownItems = (role: string | null) => {
  switch (role) {
    case 'director':
      return profile_actions;
    case 'staff':
      return staff_profile_actions;
    case 'landlord':
      return user_profile_actions;
    case 'account':
      return account_profile_actions;
    case 'manager':
      return manager_profile_actions;
    default:
      return null;
  }
};

export const getSettingsLinks = (role: string | null) => {
  switch (role) {
    case 'director':
      return settings_link_tabs;
    case 'staff':
      return staff_settings_link_tabs;
    case 'manager':
      return manager_settings_link_tabs;
    default:
      return null;
  }
};

export const getSettingsPath: any = (role: string | null) => {
  switch (role) {
    case 'director':
      return '/';
    case 'landlord':
      return '/user/';
    case 'staff':
      return '/staff/';
    case 'account':
      return '/accountant/';
    case 'manager':
      return '/manager/';
    default:
      return null;
  }
};

export const getRoleSignInPage = (role: string | null): string => {
  switch (role) {
    case 'director':
      return '/auth/sign-in';
    case 'manager':
      return '/auth/user/sign-in';
    default:
      return '/auth/user/sign-in';
  }
};

export const getRentalPropertyCreatePath = (role: string | null): string => {
  switch (role) {
    case 'director':
      return '/management/properties/create-rental-property';
    case 'manager':
      return '/manager/management/properties/create-rental-property';
    case 'account':
      return '/accountant/management/properties/create-rental-property';
    default:
      return '/management/properties/create-rental-property';
  }
};

export const getFacilityPropertyCreatePath = (role: string | null): string => {
  switch (role) {
    case 'director':
      return '/management/properties/create-gated-estate-property';
    case 'manager':
      return '/manager/management/properties/create-gated-estate-property';
    case 'account':
      return '/accountant/management/properties/create-gated-estate-property';
    default:
      return '/management/properties/create-gated-estate-property';
  }
};

interface LoginResponse {
  message: string;
  access_token: string;
  data: {
    details: {
      id: string;
      user_id: string;
      email: string;
      role: [string];
      email_verification: boolean;
    };
  };
  wallet_pin_status: boolean;
  wallet_id: string | null;
  additional_details: {
    status: "approved" | "pending" | "rejected"
    user_id: string;
    branch: {
      id: string | null;
      picture: string | null;
    };
    // company: {
    id: string | null;
    company_logo: string | null;
    dark_logo: string | null;
    // };
    settings: {
      appearance: any;
    };
  };
}

const base_url = `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/`;

export const auth_slider_content: AuthSliderContent = [
  {
    title: 'Property Manager',
    desc: 'The company specializes in managing tenants for both commercial and residential properties, as well as overseeing occupants within gated estates.',
  },
  {
    title: 'Hospitality Manager',
    desc: 'The company specializes in managing short-stay apartments, holiday homes, and hotels, catering to occupants for brief durations.',
  },
  {
    title: 'Property Developer',
    desc: 'A company engaged in real estate development, constructing and selling properties, or acquiring land for development and subsequent sale. They also offer flexible payment plans.',
  },
];

// Login function
export const login = async (formData: Record<string, any>) => {
  try {
    Cookies.remove("role");
    const { data } = await axios.post<LoginResponse>(
      `${base_url}login`,
      formData
    );
    useAuthStore.getState().reset();
    const token = data.access_token;
    const email = data.data.details?.email || formData.email;
    const emailVerified = data.data.details.email_verification;
    const role = data.data.details.role[0];
    const managerId = data.data.details.id
    // console.log('res', data);
    const additional_details = data?.additional_details;
    const appearance = data?.additional_details?.settings?.appearance;
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
    const company_status = additional_details.status;

    // SAVE TO ZUSTAND
    useAuthStore.getState().setAuthState('token', token);
    useAuthStore.getState().setAuthState('role', role);
    useAuthStore.getState().setAuthState('email', email);
    useAuthStore.getState().setAuthState('user_id', details?.user_id);
    useAuthStore.getState().setAuthState('additional_details', details);

    // setPersonalInfo("company_status", company.company_status);

    // save user id to localstorage for msg
    saveLocalStorage("user_id", details?.user_id || managerId)


    //💀⚡ SECURE USER - DO NOT TOUCH 💀⚡
    await saveRoleToCookie(role); //DO NOT REMOVE THIS - IT'S FOR AUTHENTICATION & AUTHORIZATION (SERVER COOKIE)
    await saveClientRoleToCookie(role); //DO NOT REMOVE THIS - IT'S FOR AUTHENTICATION & AUTHORIZATION (BROWSER COOKIE)
    await saveCompanyStatusToCookie(company_status); //DO NOT REMOVE THIS - IT'S FOR AUTHENTICATION & AUTHORIZATION (SERVER COOKIE)
    
    if (emailVerified) {
      toast.success(data?.message || 'Login successful!');
      if (role === 'user') {
        return 'redirect to setup';
      } else {
        useWalletStore
          .getState()
          .setWalletStore('walletPinStatus', data.wallet_pin_status);
        useWalletStore.getState().setWalletStore('walletId', data.wallet_id);
        return 'redirect to dashboard';
      }
    }
    if (!emailVerified) {
      useAuthStore.getState().setAuthState('emailVerified', false);
      toast.warning('Please verify your email to continue');
      return 'redirect to verify email';
    }
  } catch (error) {
    console.error(error)
    handleAxiosError(error, 'Login failed. Please try again.');
  }
};

// Signup function
export const signup = async (
  formData: Record<string, any>
): Promise<boolean> => {
  try {
    const { data } = await axios.post(`${base_url}register`, formData);
    const token = data.access_token;
    useAuthStore.getState().setAuthState('token', token);
    useAuthStore.getState().setAuthState('email', formData.email);
    toast.success(data?.message || 'Signup successful!');
    return true;
  } catch (error) {
    handleAxiosError(error, 'Signup failed. Please try again.');
    console.error(error)
    return false;
  }
};

export const verifyEmail = async (otp: string): Promise<boolean> => {
  const token = useAuthStore.getState().token;
  try {
    const { data } = await axios.post(
      `${base_url}verify-email`,
      { otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const message = data?.message || 'Email verified successfully!';
    toast.success(message);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Verification failed. Please try again.');
    return false;
  }
};

export const resendOtp = async (): Promise<boolean> => {
  const token = useAuthStore.getState().token;
  try {
    const { data } = await axios.post(
      `${base_url}resend-otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(data?.message || 'OTP resent successfully!');
    return true;
  } catch (error) {
    handleAxiosError(error, 'Failed to resend OTP. Please try again.');
    return false;
  }
};

export const logout = async (): Promise<boolean> => {
  const resetAuthStore = useAuthStore.getState().reset;
  try {
    const { data } = await api.post('logout');
    const message = data?.message || 'Successfully logged out';
    resetAuthStore();
    toast.success(message);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Logout failed. Please try again.');
    return false;
  }
};

export const requestPasswordReset = async (formData: InputData) => {
  try {
    const { data } = await axios.post(`${base_url}password/reset`, formData);
    toast.success(data?.message || 'Password reset OTP sent successfully!');
    const email =
      formData instanceof FormData
        ? (formData.get('email') as string)
        : formData.email;
    useAuthStore.getState().reset(email);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Failed to send password reset OTP.');
    return false;
  }
};

export const verifyOtpAndResetPassword = async (code: string) => {
  const email = useAuthStore.getState().email;
  try {
    const { data } = await axios.post(`${base_url}password/reset/verify`, {
      identifier: email,
      code,
    });
    const message = data?.message || 'OTP validated successfully!';
    toast.success(message);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Failed to validate OTP.');
    return false;
  }
};

export const updatePassword = async (formData: FormData) => {
  const email = useAuthStore.getState().email;
  try {
    const { data } = await axios.put(`${base_url}password/reset/update`, {
      identifier: email,
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
    });
    const message = data?.message || 'Password updated successfully!';
    toast.success(message);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Failed to update password.');
    return false;
  }
};



export function applyFont(font: string) {
  if (typeof window !== "undefined" && font) {
    // Store the selected font in localStorage
    localStorage.setItem("selectedFont", font);

    // Create a link element for the Google Font
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
    link.rel = "stylesheet";

    // Append the link to the document head if not already appended
    const existingLink = document.head.querySelector(`link[href="${link.href}"]`);
    if (!existingLink) {
      document.head.appendChild(link);
    }

    // Set the font family on the body
    document.body.style.fontFamily = font;
  }
}
