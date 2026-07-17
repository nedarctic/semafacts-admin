import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "./lib/types/user-role.enum";

export default async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin') && pathname !== '/admin-login' && (!token || token.role !== UserRole.ADMIN)) {
        const loginUrl = new URL('/admin-login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/handler') && pathname !== "/handler-login" && (!token || token.role !== UserRole.HANDLER)) {
        const loginUrl = new URL('/handler-login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();

}