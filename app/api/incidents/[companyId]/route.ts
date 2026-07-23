import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(`${process.env.FRONTEND_URL}/admin-login`);
        }
        const { accessToken } = session;
        const { companyId } = await params;

        const url = `${process.env.BACKEND_URL}/incidents/${companyId}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
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
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
    try {

        const { companyId } = await params;

        const formData = await req.formData();

        const url = `${process.env.BACKEND_URL}/incidents/${companyId}`;

        const res = await fetch(url, {
            method: "POST",
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
        }, { status: 500 });
    }
}