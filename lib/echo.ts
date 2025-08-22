// // import { initializeEcho } from '@/lib/echo';
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import { getLocalStorage } from '@/utils/local-storage';
// import { configureEcho } from "@laravel/echo-react";

// // // Explicitly type echoInstance with the 'pusher' broadcaster
// // let echoInstance: Echo<'reverb'> | null = null;

// // export const initializeEcho = () => {
// //   if (typeof window === 'undefined' || echoInstance) {
// //     return echoInstance;
// //   }

// //   try {
// //     const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
// //     const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
// //     const pusherHost = process.env.NEXT_PUBLIC_PUSHER_HOST || `ws-${pusherCluster}.pusher.com`;
// //     const pusherPort = process.env.NEXT_PUBLIC_PUSHER_PORT || 80;

// //     if (!pusherKey || !pusherCluster) {
// //       throw new Error('Pusher configuration missing: key or cluster not defined');
// //     }

// //     const authToken = getLocalStorage('authToken');

// //     console.log('Initializing Echo with config:', {
// //       key: pusherKey,
// //       cluster: pusherCluster,
// //       host: pusherHost,
// //       port: pusherPort,
// //     });

// //     echoInstance = new Echo<'reverb'>({
// //       broadcaster: 'reverb',
// //       key: pusherKey,
// //       cluster: pusherCluster,
// //       wsHost: pusherHost,
// //       wsPort: pusherPort ? Number(pusherPort) : 80,
// //       wssPort: pusherPort ? Number(pusherPort) : 443,
// //       forceTLS: true,
// //       enabledTransports: ['ws', 'wss'],
// //       authEndpoint: 'https://be1.ourproperty.ng/broadcasting/auth',
// //       auth: {
// //         headers: {
// //           'X-XSRF-TOKEN': getXsrfToken(),
// //           Authorization: authToken ? `Bearer ${authToken}` : '',
// //           Accept: 'application/json',
// //         },
// //       },
// //     });

// //     // Log connection events for debugging
// //     echoInstance.connector.pusher.connection.bind('connected', () => {
// //       console.log('✅ Pusher connected successfully');
// //     });

// //     echoInstance.connector.pusher.connection.bind('error', (err: any) => {
// //       console.error('❌ Pusher connection error:', err);
// //     });

// //     return echoInstance;
// //   } catch (error) {
// //     console.error('Echo initialization failed:', error);
// //     return null;
// //   }
// // };

// // const getXsrfToken = (): string => {
// //   try {
// //     const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
// //     const token = cookie ? decodeURIComponent(cookie[1]) : '';
// //     if (!token) {
// //       console.warn('XSRF-TOKEN cookie not found');
// //     }
// //     return token;
// //   } catch (error) {
// //     console.error('Error retrieving XSRF token:', error);
// //     return '';
// //   }
// // };


// const initializeEcho = () => {
//   return configureEcho({
//     broadcaster: "reverb",
//     key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
//     wsHost: process.env.NEXT_PUBLIC_REVERB_HOST, // e.g. "socket.ourproperty.ng"
//     wsPort: 80,
//     wssPort: 443,
//     forceTLS: true,
//     enabledTransports: ["ws", "wss"],
//     authEndpoint: "/broadcasting/auth",
//     auth: {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
//       },
//     },
//   });
// };




// export default initializeEcho;



import Echo from "laravel-echo";
import Pusher from "pusher-js";
import React from "react";

// Type definitions
import { Transport } from "pusher-js/types/src/core/config";

interface EchoConfig {
  broadcaster: "reverb";
  key: string;
  wsHost: string;
  wsPort: number;
  wssPort: number;
  forceTLS: boolean;
  enabledTransports: Transport[];
  authEndpoint: string;
  auth: {
    headers: Record<string, string>;
  };
  authorizer?: (channel: any, options: any) => any;
}

interface UseEchoReturn {
  echo: Echo<"reverb"> | null;
  isConnected: boolean;
  error: Error | null;
}


interface AuthResponse {
  auth?: string;
  [key: string]: any;
}

let echo: Echo<"reverb"> | null = null;
let isInitializing = false;

// Make Pusher available globally for Laravel Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

export async function initializeEcho(): Promise<Echo<"reverb"> | null> {
  // Only run on client side
  if (typeof window === 'undefined') return null;

  if (echo) return echo;

  if (isInitializing) {
    return new Promise<Echo<"reverb">>((resolve) => {
      const check = () => {
        if (echo) resolve(echo);
        else setTimeout(check, 100);
      };
      check();
    });
  }

  isInitializing = true;
  const transports: ("ws" | "wss")[] = ["ws", "wss"];

  try {
    const authToken = localStorage.getItem("authToken");

    console.log("token here", { authToken })
    if (!authToken) {
      throw new Error("No authentication token found");
    }
    // Create Echo instance
    echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST!,
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "80"),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "443"),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "https") === "https",
      enabledTransports: ["ws", "wss"] as Transport[],
      authEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${authToken.slice(1, -1)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (
            socketId: string,
            callback: (error: boolean, data?: any) => void
          ) => {
            const requestData = {
              socket_id: socketId,
              channel_name: channel.name,
            };
            fetch(options.authEndpoint, {
              method: "POST",
              headers: {
                ...options.auth.headers,
                "X-Socket-ID": socketId,
              },
              body: JSON.stringify(requestData),
            })
              .then(async (response: Response) => {
                console.log(`Auth response for ${channel.name}: `, {
                  status: response.status,
                  statusText: response.statusText,
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error(
                    `Channel auth failed: ${channel.name}`,
                    response.status,
                    errorText
                  );
                  throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                const data: AuthResponse = await response.json();
                console.log(`Channel auth success: ${channel.name}`);
                return data;
              })
              .then((data: AuthResponse) => {
                callback(false, data);
              })
              .catch((error: Error) => {
                console.error(`Error authorizing channel ${channel.name}: `, error);
                callback(true, error);
              });
          },
        };
      },
    } as EchoConfig);

    // Connection event handlers
    if (echo.connector && (echo.connector as any).pusher) {
      const pusher = (echo.connector as any).pusher;

      if (pusher.connection) {
        pusher.connection.bind("connecting", () => {
          console.log("Echo connecting to WebSocket server...");
        });

        pusher.connection.bind("connected", () => {
          console.log("Echo connected successfully to WebSocket server");
        });

        pusher.connection.bind("error", (error: any) => {
          console.error("Pusher connection error:", error);
        });

        pusher.connection.bind("disconnected", () => {
          console.log("Echo disconnected from WebSocket server");
        });
      }
    }

    return echo;
  } catch (error) {
    console.error("Echo initialization failed:", error);
    echo = null;
    throw error;
  } finally {
    isInitializing = false;
  }
}


export function getEcho(): Echo<"reverb"> | null {
  if (!echo) {
    console.warn("getEcho called before Echo was initialized");
  }
  return echo;
}

export function disconnectEcho(): void {
  if (echo) {
    echo.disconnect();
    echo = null;
    console.log("Echo disconnected and reset");
  }
}

export function useEcho(): UseEchoReturn {
  const [echoInstance, setEchoInstance] = React.useState<Echo<"reverb"> | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const setupEcho = async () => {
      try {
        const instance = await initializeEcho();

        if (!mounted || !instance) return;

        setEchoInstance(instance);
        setError(null);

        // Monitor connection status
        const connector = (instance.connector as any);
        if (connector?.pusher?.connection) {
          const connection = connector.pusher.connection;

          const handleConnected = () => {
            if (mounted) setIsConnected(true);
          };

          const handleDisconnected = () => {
            if (mounted) setIsConnected(false);
          };

          const handleError = (err: any) => {
            if (mounted) {
              setError(new Error(err.message || 'Connection error'));
              setIsConnected(false);
            }
          };

          connection.bind("connected", handleConnected);
          connection.bind("disconnected", handleDisconnected);
          connection.bind("error", handleError);

          // Set initial connection state
          if (connection.state === 'connected') {
            setIsConnected(true);
          }

          // Cleanup function
          return () => {
            connection.unbind("connected", handleConnected);
            connection.unbind("disconnected", handleDisconnected);
            connection.unbind("error", handleError);
          };
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error("Failed to initialize Echo:", err);
        }
      }
    };

    setupEcho();

    return () => {
      mounted = false;
    };
  }, []);

  return { echo: echoInstance, isConnected, error };
}



