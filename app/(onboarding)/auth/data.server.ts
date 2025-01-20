// import {
//   manager_nav_items,
//   nav_items,
//   account_nav_items,
//   tabs,
//   accountant_search_tabs,
//   staff_nav_items,
// } from '@/components/Nav/data';
// import {
//   manager_settings_link_tabs,
//   settings_link_tabs,
//   staff_settings_link_tabs,
// } from '@/components/Settings/data';
// import {
//   create_new_items,
//   manager_create_new_items,
//   accountant_create_new_items,
// } from '@/components/Nav/nav-create-new-items';
// import {
//   manager_profile_actions,
//   profile_actions,
//   account_profile_actions,
// } from '@/components/Nav/options';
// import { saveRoleToCookie } from '@/utils/saveRole';
// import { encrypt } from '@/utils/authRole';
// import { cookies } from 'next/headers';

// export const getDashboardPage = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return '/dashboard';
//     case 'tenant':
//       return '/dashboard';
//     case 'manager':
//       return '/manager/dashboard';
//     case 'account':
//       return '/accountant/dashboard';
//     case 'staff':
//       return '/staff/dashboard';
//     default:
//       return '/aunthorized';
//   }
// };

// export const getNavs = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return nav_items;
//     case 'tenant':
//       return nav_items;
//     case 'account':
//       return account_nav_items;
//     case 'staff':
//       return staff_nav_items;
//     case 'manager':
//       return manager_nav_items;
//     default:
//       return null;
//   }
// };

// export const getGlobalSearchTabs = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return tabs;
//     case 'tenant':
//       return tabs;
//     case 'account':
//       return accountant_search_tabs;
//     case 'manager':
//       return tabs;
//     default:
//       return null;
//   }
// };

// export const getNavCreateItems = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return create_new_items;
//     case 'tenant':
//       return create_new_items;
//     case 'account':
//       return accountant_create_new_items;
//     case 'manager':
//       return manager_create_new_items;
//     default:
//       return null;
//   }
// };

// export const getProfileDropdownItems = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return profile_actions;
//     case 'tenant':
//       return profile_actions;
//     case 'account':
//       return account_profile_actions;
//     case 'manager':
//       return manager_profile_actions;
//     default:
//       return null;
//   }
// };

// export const getSettingsLinks = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return settings_link_tabs;
//     case 'staff':
//       return staff_settings_link_tabs;
//     case 'manager':
//       return manager_settings_link_tabs;
//     default:
//       return null;
//   }
// };

// export const getSettingsPath: any = (role: string | null) => {
//   switch (role) {
//     case 'director':
//       return '/';
//     case 'staff':
//       return '/staff/';
//     case 'account':
//       return '/accountant/';
//     case 'manager':
//       return '/manager/';
//     default:
//       return null;
//   }
// };

// export const getRoleSignInPage = (role: string | null): string => {
//   switch (role) {
//     case 'director':
//       return '/auth/sign-in';
//     case 'manager':
//       return '/auth/user/sign-in';
//     default:
//       return '/auth/user/sign-in';
//   }
// };

// export const getRentalPropertyCreatePath = (role: string | null): string => {
//   switch (role) {
//     case 'director':
//       return '/management/properties/create-rental-property';
//     case 'manager':
//       return '/manager/management/properties/create-rental-property';
//     case 'account':
//       return '/accountant/management/properties/create-rental-property';
//     default:
//       return '/management/properties/create-rental-property';
//   }
// };

// export const getFacilityPropertyCreatePath = (role: string | null): string => {
//   switch (role) {
//     case 'director':
//       return '/management/properties/create-gated-estate-property';
//     case 'manager':
//       return '/manager/management/properties/create-gated-estate-property';
//     case 'account':
//       return '/accountant/management/properties/create-gated-estate-property';
//     default:
//       return '/management/properties/create-gated-estate-property';
//   }
// };

