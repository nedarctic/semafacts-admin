import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
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
                <div className="flex flex-col gap-6">
                    <p className="text-2xl">Settings</p>
                    <p className="text-md">Could not fetch the company details. Please refresh the page or try again later.</p>
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
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableCell>{company.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>SLA Days</TableHead>
                            <TableCell>{company.slaDays}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableCell>{company.logoUrl ? <p className="font-medium">Set</p> : <p className="font-medium">Not set</p>}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}