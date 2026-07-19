import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest, { params }: { params: Promise<{ incidentId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect("/admin-login");
        };
        const { accessToken } = session;
        const { incidentId } = await params;
        const body = await req.json();

        const url = `${process.env.BACKEND_API_URL}/messages/${incidentId}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: await res.text()
            });
        };

        const data = await res.json();

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, {status: 500})
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ incidentId: string }> }) { 
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect("/admin-login");
        };
        const { accessToken } = session;
        const { incidentId } = await params;

        const url = `${process.env.BACKEND_API_URL}/messages/${incidentId}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: await res.text()
            }, {status: res.status});
        };

        const data = await res.json();

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, {status: 500})
    }
}