import { BreadCrumb } from "@/components/breadcrumb";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getHandlerIncidents } from "@/lib/helpers/handlers.helpers";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { PaginationComponent } from "@/components/pagination";

export default async function IncidentsPage({ searchParams }: {
    searchParams: Promise<{
        page: string;
        limit: string;
        search: string;
    }>
}) {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/handler-login");
    }
    const { user, accessToken } = session;
    const { id } = user;

    const {
        limit = "10",
        page = "1",
        search
    } = await searchParams;

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    search && params.set("search", search);

    const url = `${process.env.BACKEND_URL}/handlers/${id}/incidents?${params.toString()}`;

    const { success, data } = await getHandlerIncidents(accessToken, url);

    if (!success) {
        return <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Incidents" />
            <div className="flex flex-col gap-6">
                <p className="text-2xl">Incidents</p>
                <p className="text-md">Failed to fetch incidents. Refresh the page or try again later.</p>
            </div>
        </div>
    }

    const { incidents, meta } = data!;

    const headers = [
        { label: "Incident ID", key: "incidentIdDisplay" },
        { label: "Category", key: "category" },
        { label: "Created", key: "createdAt" },
        { label: "Deadline", key: "deadlineAt" },
        { label: "Status", key: "status" },
    ];

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Incidents" />
            <div className="flex flex-col gap-6">
                <p className="font-bold text-xl">Incidents</p>
                <SearchInput placeholder="Search incidents..." />
                <TableData path={"/handler"} data={incidents} headers={headers} />
                <PaginationComponent meta={meta} />
            </div>
        </div>
    )
}