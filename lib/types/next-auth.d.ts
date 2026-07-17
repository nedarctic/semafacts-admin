import { DefaultSession, User } from "next-auth";
import { UserRole } from "./user-role.enum";
import { NumberFieldIncrement } from "@base-ui/react";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            companyId: string;
            role: UserRole;
        } & DefaultSession["user"];
        accessToken: string;
        refreshToken: string;
    }

    interface User extends DefaultUser {
        id: string;
        name: string;
        email: string;
        companyId: string;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
        expiresAt: NumberFieldIncrement
    };
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        companyId: string;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
    }
}