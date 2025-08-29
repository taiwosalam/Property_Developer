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
  reconnect: () => Promise<void>;
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

// Helper function to wait for auth token with timeout
async function waitForAuthToken(maxAttempts = 60, intervalMs = 400): Promise<string | null> {
  let attempts = 0;

  return new Promise((resolve) => {
    const checkToken = () => {
      const token = localStorage.getItem("authToken");

      if (token && token !== 'null' && token !== 'undefined') {
        resolve(token);
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        resolve(null);
        return;
      }

      setTimeout(checkToken, intervalMs);
    };

    checkToken();
  });
}

// Helper function to clean auth token (remove quotes if present)
function cleanAuthToken(token: string): string {
  // Remove surrounding quotes if present
  return token.replace(/^["']|["']$/g, '');
}

export async function initializeEcho(forceReconnect = false): Promise<Echo<"reverb"> | null> {
  // Only run on client side
  if (typeof window === 'undefined') return null;

  // If forcing reconnect, disconnect existing instance
  if (forceReconnect && echo) {
    disconnectEcho();
  }

  if (echo && !forceReconnect) return echo;

  if (isInitializing) {
    return new Promise<Echo<"reverb"> | null>((resolve) => {
      const check = () => {
        if (echo) resolve(echo);
        else if (!isInitializing) resolve(null);
        else setTimeout(check, 100);
      };
      check();
    });
  }

  isInitializing = true;

  try {
    // Wait for auth token to be available
    console.log("Waiting for auth token...");
    const authToken = await waitForAuthToken();

    if (!authToken) {
      throw new Error("Authentication token not available after waiting");
    }

    const cleanToken = cleanAuthToken(authToken);
    console.log("Auth token found, initializing Echo...", { tokenLength: cleanToken.length });

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
          Authorization: `Bearer ${cleanToken}`,
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
            // Get fresh token for each authorization request
            const currentToken = localStorage.getItem("authToken");
            if (!currentToken) {
              callback(true, new Error("No auth token available"));
              return;
            }

            const requestData = {
              socket_id: socketId,
              channel_name: channel.name,
            };

            const headers = {
              ...options.auth.headers,
              Authorization: `Bearer ${cleanAuthToken(currentToken)}`,
              "X-Socket-ID": socketId,
            };

            fetch(options.authEndpoint, {
              method: "POST",
              headers,
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

        pusher.connection.bind("unavailable", () => {
          console.warn("Echo connection unavailable");
        });

        pusher.connection.bind("failed", () => {
          console.error("Echo connection failed");
        });
      }
    }

    console.log("Echo initialized successfully");
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

  const reconnect = React.useCallback(async () => {
    try {
      setError(null);
      console.log("Attempting to reconnect Echo...");
      const instance = await initializeEcho(true); // Force reconnect
      if (instance) {
        setEchoInstance(instance);
        console.log("Echo reconnected successfully");
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Failed to reconnect Echo:", error);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    let connectionCleanup: (() => void) | null = null;

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
            if (mounted) {
              setIsConnected(true);
              setError(null);
            }
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

          const handleUnavailable = () => {
            if (mounted) {
              setError(new Error('Connection unavailable'));
              setIsConnected(false);
            }
          };

          const handleFailed = () => {
            if (mounted) {
              setError(new Error('Connection failed'));
              setIsConnected(false);
            }
          };

          connection.bind("connected", handleConnected);
          connection.bind("disconnected", handleDisconnected);
          connection.bind("error", handleError);
          connection.bind("unavailable", handleUnavailable);
          connection.bind("failed", handleFailed);

          // Set initial connection state
          if (connection.state === 'connected') {
            setIsConnected(true);
          }

          // Cleanup function
          connectionCleanup = () => {
            connection.unbind("connected", handleConnected);
            connection.unbind("disconnected", handleDisconnected);
            connection.unbind("error", handleError);
            connection.unbind("unavailable", handleUnavailable);
            connection.unbind("failed", handleFailed);
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
      if (connectionCleanup) {
        connectionCleanup();
      }
    };
  }, []);

  // Auto-reconnect when auth token becomes available
  React.useEffect(() => {
    if (error && error.message.includes("Authentication token not available")) {
      console.log("Auth token error detected, will retry when token becomes available");

      const checkTokenAndReconnect = async () => {
        const token = await waitForAuthToken(10, 1000); // Wait up to 10 seconds
        if (token) {
          console.log("Auth token now available, attempting reconnect...");
          reconnect();
        }
      };

      checkTokenAndReconnect();
    }
  }, [error, reconnect]);

  return { echo: echoInstance, isConnected, error, reconnect };
}