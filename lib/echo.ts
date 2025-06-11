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





// export function initializeEcho() {
//   try {
//     if (!(window as any).Pusher) {
//       (window as any).Pusher = Pusher;
//     }

//     const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
//     const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

//     if (!pusherKey || !pusherCluster) {
//       throw new Error("Pusher configuration missing");
//     }

//     console.log("Initializing Echo:", {
//       key: pusherKey,
//       cluster: pusherCluster,
//     });

//     const echo = new Echo({
//       broadcaster: "pusher",
//       key: pusherKey,
//       cluster: pusherCluster,
//       forceTLS: true,
//       authorizer: (channel: any, options: any) => {
//         return {
//           authorize: async (
//             socketId: string,
//             callback: (error: boolean, data: any) => void
//           ) => {
//             try {
//               const response = await api.post(
//                 "/broadcasting/auth",
//                 {
//                   socket_id: socketId,
//                   channel_name: channel.name,
//                 },
//                 {
//                   headers: {
//                     Accept: "application/json",
//                   },
//                 }
//               );

//               console.log("Broadcasting auth response:", response.data);
//               callback(false, response.data);
//             } catch (error) {
//               console.error("Broadcasting auth error:", error);
//               callback(true, error);
//             }
//           },
//         };
//       },
//     });

//     return echo;
//   } catch (error) {
//     console.error("Echo initialization failed:", error);
//     return null;
//   }
// }
