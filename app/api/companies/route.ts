import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/admin-login');
        }
        const { accessToken, user } = session;
        const { companyId } = user;

        const url = `${process.env.BACKEND_API_URL}/companies/${companyId}`;
        const formData = await req.formData();

        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: await res.text()
            }, {status: res.status});
        }

        const data = await res.json();
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

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect('/admin-login');
        }
        const { accessToken, user } = session;
        const { companyId } = user;

        const url = `${process.env.BACKEND_API_URL}/companies/${companyId}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: await res.text(),
            }, {status: res.status});
        }

        const data = await res.json();

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