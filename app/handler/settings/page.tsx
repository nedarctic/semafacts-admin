import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { TableData } from "@/components/table-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UpdateUserDrawer } from "@/components/update-user-handler";
import { getUser } from "@/lib/helpers/users.helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/handler-login")
    }
    const { user, accessToken } = session;

    console.log("user id", user.id);

    const { data } = await getUser(accessToken, user.id);

    if (!data) {
        return <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Settings" />
            <div>
                <p className="text-2xl">Settings</p>
                <p className="text-md">Could not fetch user data. Refresh the page or try again later.</p>
            </div>
        </div>
    }

    const headers = [
        { label: "Name", key: "" }
    ];

    const propData = {
        id: data.id,
        name: data.name,
        email: data.email
    } as {
        id: string;
        name: string;
        email: string;
    }

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Settings" />
            <div className="flex flex-row justify-between">
                <p className="font-bold text-xl">Settings</p>
                <UpdateUserDrawer data={propData} />
            </div>
            <div className="flex flex-col gap-2">

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableCell>{data.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableCell>{data.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableCell>{data.role}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableCell>{data.status}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Incidents</TableHead>
                            <TableCell>{data.incidentHandlers!.length}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table></div>
        </div>
    )
}