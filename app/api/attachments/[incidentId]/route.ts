import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST (req: NextRequest, { params }: {
    params: Promise<{
        incidentId: string
    }>
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.redirect(`${process.env.FRONTEND_URL}/admin-login`);
        }
        const { accessToken } = session;
        const { incidentId } = await params;

        const formData = await req.formData();
        const url = `${process.env.BACKEND_URL}/attachments/${incidentId}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });

        const data = await res.json();

        if(!res.ok){
            return NextResponse.json({
                success: false,
                error: data.error || data.message || "Backend request error"
            });
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