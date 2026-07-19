import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect('/login');
        }
        const { accessToken } = session;

        const url = `${process.env.BACKEND_API_URL}/incidents`;
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

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            redirect('/login');
        }
        const { accessToken } = session;

        const formData = await req.formData();
        const url = `${process.env.BACKEND_API_URL}/incidents`;
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
        }, { status: 500 });
    }
}