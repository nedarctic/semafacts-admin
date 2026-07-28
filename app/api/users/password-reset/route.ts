import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("password reset request body", body);
        const url = `${process.env.BACKEND_URL}/users/password-reset`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            return NextResponse.json({
                success: false,
                error: await res.text()
            }, { status: res.status })
        }

        const data = await res.json();
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