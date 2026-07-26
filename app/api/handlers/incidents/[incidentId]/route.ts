import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: {
    params: Promise<{
        incidentId: string;
    }>
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(`${process.env.FRONTEND_URL}/handler-login`);
        }
        const { accessToken, user } = session;
        const { companyId } = user;
        const body = await req.json();

        const { incidentId } = await params;
        const url = `${process.env.BACKEND_URL}/incidents/${incidentId}`;
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({
                success: false,
                error: data.message
            }, { status: res.status })
        }

        return NextResponse.json({
            success: true,
            data
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}