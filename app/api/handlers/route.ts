import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(`${process.env.FRONTEND_URL}/admin-login`);
        }
        const { accessToken, user } = session;
        const { companyId } = user;

        const handlerId = req.nextUrl.searchParams.get("handlerId");
        const incidentId = req.nextUrl.searchParams.get("incidentId");

        const body = await req.json();

        console.log("invite body", body)

        const url = `${process.env.BACKEND_URL}/handlers/${handlerId}/incidents/${incidentId}/assign`;

        const res = await fetch(url, {
            method: "PATCH",
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