
// lib/pusher.js
import Pusher from 'pusher-js';

let pusher: Pusher | null = null;

const initializePusher = () => {
  if (!pusher) {
    pusher = new Pusher(`${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`, { // Use environment variable
      cluster: `${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}`, // Use environment variable
      forceTLS: true,
    });
  }
  return pusher;
};

export default initializePusher;