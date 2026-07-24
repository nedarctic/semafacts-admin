import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const token = req.nextUrl.searchParams.get("token");
        const params = new URLSearchParams();

        if (!token) {
            return NextResponse.json({
                success: false,
                error: "Missing token"
            })
        }

        const body = await req.json();
        console.log("token verify body", body);
        params.append("token", token);
        const url = `${process.env.BACKEND_URL}/invites/verify?${params.toString()}`;

        console.log("url at api route", url)
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        console.log("token verification res", res)

        const {error, message, data} = await res.json();

        console.log("token verification data", data)

        if (!res.ok) {
            console.log("error", error)
            console.log("error message", message)
            return NextResponse.json({
                success: false,
                error: message
            })
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}