import { IronSession } from 'next-iron-session'; // Import IronSession types from next-iron-session

declare module 'next' {
  interface NextApiRequest extends IronSession {}
  interface NextRequest extends IronSession {}
}
