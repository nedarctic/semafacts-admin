import { User } from "./user";

export interface InviteToken {
    id: string;
    userId: string;
    tokenHash: string;
    used: boolean;
    expiresAt: string;
    createdAt: string;
    user?: User;
}