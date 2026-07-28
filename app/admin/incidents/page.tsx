import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { PaginationComponent } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { Incident } from "@/lib/types/incident";
import { UserRole } from "@/lib/enums/user-role.enum";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function IncidentsPage({ searchParams }: {
    searchParams: Promise<{
        page: string;
        limit: string;
        search: string;
    }>
}) {

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
        redirect("admin-login");
    };
    const { user, accessToken } = session;
    const { companyId } = user;

    const {
        limit = "10",
        page = "1",
        search
    } = await searchParams;

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    search && params.set("search", search);

    const url = `${process.env.BACKEND_URL}/companies/${companyId}/incidents?${params.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb currentPage="Incidents" />
                <div className="flex flex-col gap-6">
                    <p className="text-2xl">Incidents</p>
                    <p className="text-md">Failed to fetch incidents. Refresh the page or try again later.</p>
                </div>
            </div>
        )
    }

    const { incidents, meta }: {
        incidents: Incident[]; 
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    } = await res.json();

    const headers = [        
        {label: "Incident ID", key: "incidentIdDisplay"},
        {label: "Category", key: "category"},
        {label: "Created", key: "createdAt"},
        {label: "Deadline", key: "deadlineAt"},
        {label: "Status", key: "status"},
    ];

    return (
        <div className="flex min-h-screen flex-col gap-8">
            <BreadCrumb currentPage="Incidents" />

            <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Overview
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Incidents</h1>
            </div>

            <div className="space-y-6 border-t border-foreground/10 pt-8">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Records
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Review submitted incidents and their current status.
                    </p>
                </div>

                {incidents.length ? <div>
                    <SearchInput placeholder="Search incidents..." />
                <TableData path={"/admin/incidents"} data={incidents} headers={headers} />
                <PaginationComponent meta={meta} />
                </div> : <p className="font-medium text-md">There are no incidents yet in this institution.</p>}
            </div>
        </div>
    )
}