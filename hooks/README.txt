
# Hooks Folder

This folder contains custom React hooks. Hooks are functions that encapsulate reusable logic, which can be shared across multiple components.

## Example Folder Structure:
hooks/
├── useAuth.js
├── useAuthRedirect.js
├── useFetch.js
├── useLocalStorage.js
├── useOutsideClick.js
├── useRefetchOnEvent.js
├── useRole.js
├── useSettings.js
├── useWindowWidth.js

## Available Hooks

### useAuth
Handles authentication-related logic, such as managing user login state and token validation.

### useAuthRedirect
Manages redirect logic based on authentication status, ensuring users are routed appropriately (e.g., to login or protected routes).

### useFetch
A custom hook for making API requests, handling loading states, errors, and data fetching with a reusable interface.

### useLocalStorage
Provides utilities for interacting with the browser's localStorage, including getting and setting values.

### useOutsideClick
Detects clicks outside a specified element, useful for closing modals or dropdowns when clicking outside their boundaries.

### useRefetchOnEvent
Handles refetching data based on specific events, such as updates to settings or other global state changes.

### useRole
Manages user role context, providing access to the current user's role and methods to update it.

### useSettings
Provides access to application settings, allowing components to read and update configuration options.

### useWindowWidth
Tracks the window's width, enabling responsive design logic based on viewport size.

### hasPermission
A utility function (not a hook) for checking user permissions based on role and specific permission titles. It leverages the permissions stored in the Zustand `permissionsStore` to determine if a user has a specific permission.

#### Usage
The `hasPermission` utility is used to check if the current user has a specific permission for a given role. It is typically used in components to conditionally render UI elements or enable/disable features based on permissions.

