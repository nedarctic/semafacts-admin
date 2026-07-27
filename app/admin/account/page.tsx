import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { UpdateUserDrawer } from "@/components/update-user-handler";
import { getUser } from "@/lib/helpers/users.helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect(`${process.env.FRONTEND_URL}/admin-login`);
    }

    const { accessToken, user } = session;
    const { id } = user;

    const { success, data: admin } = await getUser(accessToken, id);

    if (!success || !admin) {
        return (
            <div className="flex min-h-screen flex-col gap-8">
                <BreadCrumb currentPage="Account" />
                <div className="space-y-4">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                        Overview
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Account</h1>
                </div>
                <div className="border-t border-foreground/10 pt-8">
                    <p className="text-lg text-muted-foreground">
                        Failed to fetch user data. Refresh the page or try again later.
                    </p>
                </div>
            </div>
        );
    }

    const userDetails = [
        { label: "Name", value: admin.name },
        { label: "Email", value: admin.email },
        { label: "Role", value: admin.role },
        { label: "Status", value: admin.status },
        { label: "Created", value: new Date(admin.createdAt!).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }) },
    ];

    const propData = {
        id: admin.id,
        name: admin.name,
        email: admin.email
    } as {
        id: string;
        name: string;
        email: string;
    }

    return (
        <div className="flex min-h-screen flex-col gap-8">
            <BreadCrumb currentPage="Account" />

            <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Overview
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Account</h1>
                    <UpdateUserDrawer data={propData} />
                </div>
            </div>

            <div className="space-y-6 border-t border-foreground/10 pt-8">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Profile details
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Your account information is shown here in a simple, structured format.
                    </p>
                </div>
                <Table>
                    <TableBody>
                        {userDetails.map((item) => (
                            <TableRow key={item.label}>
                                <TableHead className="w-32">{item.label}</TableHead>
                                <TableCell>{item.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}