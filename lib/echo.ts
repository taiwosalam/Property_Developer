import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getLocalStorage } from '@/utils/local-storage';

// Explicitly type echoInstance with the 'pusher' broadcaster
let echoInstance: Echo<'pusher'> | null = null;

export const initializeEcho = () => {
  if (typeof window === 'undefined' || echoInstance) {
    return echoInstance;
  }

  try {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
    const pusherHost = process.env.NEXT_PUBLIC_PUSHER_HOST || `ws-${pusherCluster}.pusher.com`;
    const pusherPort = process.env.NEXT_PUBLIC_PUSHER_PORT || 80;

    if (!pusherKey || !pusherCluster) {
      throw new Error('Pusher configuration missing: key or cluster not defined');
    }

    const authToken = getLocalStorage('authToken');

    console.log('Initializing Echo with config:', {
      key: pusherKey,
      cluster: pusherCluster,
      host: pusherHost,
      port: pusherPort,
    });

    echoInstance = new Echo<'pusher'>({
      broadcaster: 'pusher',
      key: pusherKey,
      cluster: pusherCluster,
      wsHost: pusherHost,
      wsPort: pusherPort ? Number(pusherPort) : 80,
      wssPort: pusherPort ? Number(pusherPort) : 443,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: '/api/broadcasting/auth',
      auth: {
        headers: {
          'X-XSRF-TOKEN': getXsrfToken(),
          Authorization: authToken ? `Bearer ${authToken}` : '',
          Accept: 'application/json',
        },
      },
    });

    // Log connection events for debugging
    echoInstance.connector.pusher.connection.bind('connected', () => {
      console.log('✅ Pusher connected successfully');
    });

    echoInstance.connector.pusher.connection.bind('error', (err: any) => {
      console.error('❌ Pusher connection error:', err);
    });

    return echoInstance;
  } catch (error) {
    console.error('Echo initialization failed:', error);
    return null;
  }
};

const getXsrfToken = (): string => {
  try {
    const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    const token = cookie ? decodeURIComponent(cookie[1]) : '';
    if (!token) {
      console.warn('XSRF-TOKEN cookie not found');
    }
    return token;
  } catch (error) {
    console.error('Error retrieving XSRF token:', error);
    return '';
  }
};

// // lib/echo.ts
// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     Echo?: Echo<'pusher'>;
//     Pusher?: typeof Pusher;
//   }
// }

// let echo: Echo | null = null;
// let isInitializing = false;

// export async function initializeEcho(): Promise<Echo | null> {
//   if (echo) return echo;
//   if (isInitializing) {
//     return new Promise((resolve) => {
//       const check = () => (echo ? resolve(echo) : setTimeout(check, 50));
//       check();
//     });
//   }

//   isInitializing = true;

//   try {
//     const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
//     const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
//     const pusherHost = process.env.NEXT_PUBLIC_PUSHER_HOST! || `ws-${pusherCluster}.pusher.com`;
//     const pusherPort = Number(process.env.NEXT_PUBLIC_PUSHER_PORT || 443);
//     const backendUrl = process.env.NEXT_PUBLIC_BASE_URL!;

//     window.Pusher = Pusher;

//     echo = new Echo({
//       broadcaster: "pusher",
//       key: pusherKey,
//       wsHost: pusherHost,
//       wsPort: pusherPort,
//       wssPort: pusherPort,
//       forceTLS: true,
//       enabledTransports: ["ws", "wss"],
//       authEndpoint: `${backendUrl}/broadcasting/auth`,
//       auth: {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           Accept: "application/json",
//         },
//       },
//       authorizer: (channel, options) => ({
//         authorize: (socketId, callback) => {
//           fetch(options.authEndpoint, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//               Accept: "application/json",
//             },
//             body: JSON.stringify({
//               socket_id: socketId,
//               channel_name: channel.name,
//             }),
//           })
//             .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//             .then((data) => callback(false, data))
//             .catch((err) => {
//               console.error("Auth error:", err);
//               callback(true, err);
//             });
//         },
//       }),
//     });

//     const conn = echo.connector?.pusher?.connection;
//     conn?.bind("connected", () => console.log("✅ Pusher connected"));
//     conn?.bind("error", (err: any) => console.error("🔌 Pusher error:", err));

//     return echo;
//   } catch (err) {
//     console.error("Echo init failed:", err);
//     echo = null;
//     return null;
//   } finally {
//     isInitializing = false;
//   }
// }
