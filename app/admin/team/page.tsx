import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AddHandlerDrawer } from "@/components/add-handler-drawer";
import { BreadCrumb } from "@/components/breadcrumb";
import { PaginationComponent } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { User } from "@/lib/types/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function TeamPage({ searchParams }: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>
}) {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login");
    }

    const { accessToken, user } = session;
    const { companyId } = user;
    const {
        limit = "10",
        page = "1",
        search,
    } = await searchParams;

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    search && params.set("search", search);

    const url = `${process.env.BACKEND_URL}/companies/${companyId}/users?${params.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb currentPage="Team" />
                <div>
                    <p className="text-2xl">Team</p>
                    <p className="font-medium text-md">Could not fetch the team data. Refresh the page or try again later.</p>
                </div>
            </div>
        )
    }

    const { users, meta }: {
        users: User[],
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        }
    } = await res.json();

    const headers = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Role", key: "role" },
        { label: "Status", key: "status" },
        { label: "Created", key: "createdAt" },
    ];

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Team" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-row justify-between w-full">
                    <p className="text-2xl">Team</p>
                    <AddHandlerDrawer companyId={companyId} />
                </div>
                <SearchInput placeholder="Search members..." />
                <TableData path={"/admin/team"} data={users} headers={headers} />
                <PaginationComponent meta={meta} />
            </div>
        </div>
    )
}