import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Company } from "@/lib/types/company";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login")
    }
    const { accessToken, user } = session;
    const { companyId } = user;

    const url = `${process.env.BACKEND_URL}/companies/${companyId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb currentPage="Reporting Page" />
                <div className="flex flex-col gap-4">
                    <p className="text-2xl">Reporting Page</p>
                    <p className="text-md font-medium">Could not fetch the reporting page details. Please refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    const company: Company = await res.json();

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Settings" />
            <div className="flex flex-col gap-4">
                <p className="text-2xl">Settings</p>
                <ul className="list-disc pl-4 space-y-2">
                    <li className="text-md">Company name: <span className="font-medium">{company.name}</span></li>
                    <li className="text-md">SLA days: <span className="font-medium">{company.slaDays}</span></li>
                </ul>
            </div>
        </div>
    )
}