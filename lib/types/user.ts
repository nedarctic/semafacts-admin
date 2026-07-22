import { UserRole } from "../enums/user-role.enum";
import { Company } from "./company";
import { IncidentHandler } from "./incident-handler";
import { InviteToken } from "./invite-token";
import { Message } from "./message";

export interface User {
    id: string;
    name?: string;
    email: string;
    password?: string;
    role?: UserRole;
    status?: UserStatus;
    refreshToken?: string;
    companyId: string;
    company?: Company;
    createdAt?: string;
    updatedAt?: string;
    inviteTokens?: InviteToken[];
    messages?: Message[];
    incidentHandlers?: IncidentHandler[];
}