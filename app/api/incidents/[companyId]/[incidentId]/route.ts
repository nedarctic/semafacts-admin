import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ incidentId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/admin-login');
        }
        const { accessToken } = session;

        const { incidentId } = await params;
        const formData = await req.formData();
        const url = `${process.env.BACKEND_URL}/incidents/${incidentId}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({
                success: false,
                error: res.statusText
            }, { status: res.status });
        };

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, {status: 500})
    }
}

export async function GET (req: NextRequest, { params }: { params: Promise<{ incidentId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/admin-login');
        }
        const { accessToken } = session;

        const { incidentId } = await params;
        const url = `${process.env.BACKEND_URL}/incidents/${incidentId}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({
                success: false,
                error: res.statusText
            }, { status: res.status });
        };

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, {status: 500})
    }
}