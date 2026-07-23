import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { UpdateCompanyDrawer } from "@/components/update-company-drawer";
import { Company } from "@/lib/types/company";
import { getServerSession } from "next-auth";
import Image from "next/image";
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

    const { logoUrl, name, slaDays } = company;

    const data = { name, logoUrl, slaDays }

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Settings" />
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <p className="text-2xl">Settings</p>
                    <UpdateCompanyDrawer data={data} />
                </div>
                <ul className="list-disc pl-4 space-y-2">
                    <li className="text-md">Company name: <span className="font-medium">{company.name}</span></li>
                    <li className="text-md">SLA days: <span className="font-medium">{company.slaDays}</span></li>
                </ul>
                <h1 className="font-semibold text-lg">Company Logo</h1>
                {logoUrl ? <div className="relative aspect-square max-w-xl">
                    <Image src={logoUrl} unoptimized alt="Company logo" fill className="rounded-md" />
                </div> : <p className="font-medium text-md">Not set.</p>}
            </div>
        </div>
    )
}