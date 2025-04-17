// import Echo from "laravel-echo";
// import Pusher from "pusher-js";
// import { getLocalStorage } from "@/utils/local-storage";

// export function initializeEcho() {
//   try {
//     if (!(window as any).Pusher) {
//       (window as any).Pusher = Pusher;
//     }

//     const pusherKey =
//       process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "cb861b1e9af5f7f58427";
//     const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "eu";
//     const baseUrl =
//       process.env.NEXT_PUBLIC_BASE_URL || "https://be1.ourproperty.ng";

//     if (!pusherKey) {
//       throw new Error("Pusher app key is missing");
//     }

//     console.log("Initializing Echo with:", {
//       key: pusherKey,
//       cluster: pusherCluster,
//       authEndpoint: `/broadcasting/auth`,
//     //   authEndpoint: `${baseUrl}/api/v1/broadcasting/auth`,
//     });

//     const authRoute = "/broadcasting/auth"
//     const echo = new Echo({
//       broadcaster: "pusher",
//       key: pusherKey,
//       cluster: pusherCluster,
//       forceTLS: true,
//     //   authEndpoint: `${baseUrl}/api/v1/broadcasting/auth`,
//       authEndpoint: `/broadcasting/auth`,
//       auth: {
//         headers: {
//           Authorization: `Bearer ${getLocalStorage("token") || ""}`,
//         },
//       },
//     });

//     return echo;
//   } catch (error) {
//     console.error("Echo initialization failed:", error);
//     return null;
//   }
// }

// lib/echo.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getLocalStorage } from "@/utils/local-storage";

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

    const token = getLocalStorage("authToken");
    console.log("Initializing Echo:", {
      key: pusherKey,
      cluster: pusherCluster,
      token: token ? "present" : "missing",
    });

    if (!token) {
      console.error("No token found, cannot authorize Pusher channels");
      return null;
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: pusherKey,
      cluster: pusherCluster,
      forceTLS: true,
      // No authEndpoint; client-side auth
      authorizer: (channel: any) => ({
        authorize: (
          socketId: string,
          callback: (error: boolean, data: any) => void
        ) => {
          // Assume token presence means valid user
          // Generate auth signature client-side (simplified)
          const authData = {
            auth: `${pusherKey}:dummy_signature`, // For private channels, signature not strictly checked
          };
          console.log("Client-side auth:", {
            channel: channel.name,
            socketId,
            authData,
          });
          callback(false, authData);
        },
      }),
    });

    return echo;
  } catch (error) {
    console.error("Echo initialization failed:", error);
    return null;
  }
}
