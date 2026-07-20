import { BreadCrumb } from "@/components/breadcrumb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function IncidentTrackingPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/reporter-login")
    }
    const { incidentId, accessToken } = session;
    console.log("Incident ID:", incidentId, "Access token:", accessToken);

    const url = `${process.env.BACKEND_API_URL}/incidents/${incidentId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const incident = await res.json();
    console.log("Incident", incident);

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Incident Details" />
            <p className="font-bold text-xl">Incident Tracking Page</p>
        </div>
    )
}