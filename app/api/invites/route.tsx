import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect("/admin-login");
        }
        const { accessToken, user } = session;
        const { companyId } = user;

        const body = await req.json();

        const url = `${process.env.BACKEND_API_URL}/invites/${companyId}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: data.message || data.error || "Backend request error"        
            });
        }

        return NextResponse.json({
            success: true,
            data
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}