import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getLocalStorage } from '@/utils/local-storage';

// Explicitly type echoInstance with the 'pusher' broadcaster
let echoInstance: Echo<'reverb'> | null = null;

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

    echoInstance = new Echo<'reverb'>({
      broadcaster: 'reverb',
      key: pusherKey,
      cluster: pusherCluster,
      wsHost: pusherHost,
      wsPort: pusherPort ? Number(pusherPort) : 80,
      wssPort: pusherPort ? Number(pusherPort) : 443,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: 'https://be1.ourproperty.ng/broadcasting/auth',
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
