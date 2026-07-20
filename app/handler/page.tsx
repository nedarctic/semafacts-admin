import { BreadCrumb } from "@/components/breadcrumb";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function IncidentsPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/handler-login");
    }
    const { user, accessToken } = session;
    const { id } = user;

    const url = `${process.env.BACKEND_API_URL}/handlers/${id}/incidents`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const data = await res.json();
    console.log("handler incidents", data);
    
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Incidents" />
            <p className="font-bold text-xl">Incidents</p>
        </div>
    )
}