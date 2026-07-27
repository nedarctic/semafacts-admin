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
        <div className="flex min-h-screen flex-col gap-8">
            <BreadCrumb currentPage="Settings" />

            <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Overview
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
                    <UpdateCompanyDrawer data={data} />
                </div>
            </div>

            <div className="space-y-6 border-t border-foreground/10 pt-8">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Company details
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Review and update your company profile information.
                    </p>
                </div>

                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableHead className="w-32">Company Name</TableHead>
                                <TableCell>{company.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="w-32">SLA Days</TableHead>
                                <TableCell>{company.slaDays}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="w-32">Logo</TableHead>
                                <TableCell>{company.logoUrl ? <p className="font-medium">Set</p> : <p className="font-medium">Not set</p>}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
            </div>
        </div>
    )
}