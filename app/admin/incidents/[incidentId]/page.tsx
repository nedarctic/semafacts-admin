import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Incident } from "@/lib/types/incident";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function IncidentDetailsPage({ params }: { params: Promise<{ incidentId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login");
    }
    const { accessToken } = session;
    const { incidentId } = await params;


    const url = `${process.env.BACKEND_API_URL}/incidents/${incidentId}`;
    
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const crumbs = [
        { label: "Incidents", link: "/admin/incidents" }
    ];

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb crumbs={crumbs} currentPage="Incident Details" />
                <div className="flex flex-col gap-6">
                    <p className="font-bold text-xl">Incident Details</p>
                    <p className="text-md font-medium">Details for incident not found. Refresh the page or try again later.</p>
                </div>
            </div>
        );
    };

    const incident: Incident = await res.json();
    console.log("Incident:", incident) 

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Incident Details" />
            <div className="flex flex-col gap-6">
                <p className="font-bold text-xl">Incident Details</p>
            </div>
        </div>
    )
}