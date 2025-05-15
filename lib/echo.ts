import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getLocalStorage } from "@/utils/local-storage";
import api from "@/services/api";

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

//     const token = getLocalStorage("authToken");
//     console.log("Initializing Echo:", {
//       key: pusherKey,
//       cluster: pusherCluster,
//       token: token ? "present" : "missing",
//     });

//     if (!token) {
//       console.error("No token found, cannot authorize Pusher channels");
//       return null;
//     }

//     const echo = new Echo({
//       broadcaster: "pusher",
//       key: pusherKey,
//       cluster: pusherCluster,
//       forceTLS: true,
//       // No authEndpoint; client-side auth
//       authorizer: (channel: any) => ({
//         authorize: (
//           socketId: string,
//           callback: (error: boolean, data: any) => void
//         ) => {
//           // Assume token presence means valid user
//           // Generate auth signature client-side (simplified)
//           const authData = {
//             auth: `${pusherKey}:dummy_signature`, // For private channels, signature not strictly checked
//           };
//           console.log("Client-side auth:", {
//             channel: channel.name,
//             socketId,
//             authData,
//           });
//           callback(false, authData);
//         },
//       }),
//     });

//     return echo;
//   } catch (error) {
//     console.error("Echo initialization failed:", error);
//     return null;
//   }
// }

export function initializeEcho() {
  try {
    if (!(window as any).Pusher) {
      (window as any).Pusher = Pusher;
    }

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      throw new Error("Pusher configuration missing");
    }

    console.log("Initializing Echo:", {
      key: pusherKey,
      cluster: pusherCluster,
    });

    const echo = new Echo({
      broadcaster: "pusher",
      key: pusherKey,
      cluster: pusherCluster,
      forceTLS: true,
      authorizer: (channel: any, options: any) => {
        return {
          authorize: async (
            socketId: string,
            callback: (error: boolean, data: any) => void
          ) => {
            try {
              const response = await api.post(
                "/broadcasting/auth",
                {
                  socket_id: socketId,
                  channel_name: channel.name,
                },
                {
                  headers: {
                    Accept: "application/json",
                  },
                }
              );

              console.log("Broadcasting auth response:", response.data);
              callback(false, response.data);
            } catch (error) {
              console.error("Broadcasting auth error:", error);
              callback(true, error);
            }
          },
        };
      },
    });

    return echo;
  } catch (error) {
    console.error("Echo initialization failed:", error);
    return null;
  }
}
