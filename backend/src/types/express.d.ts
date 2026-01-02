// Type augmentation for Express Request to include custom properties
import { AdminTokenPayload } from "@shared/plugins";

declare global {
  namespace Express {
    export interface Request {
      customerId?: string;
      customerEmail?: string;
      adminId?: string;
      adminEmail?: string;
      admin?: AdminTokenPayload;
    }
  }
}

export {};
