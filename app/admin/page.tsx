import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { IncidentTimelineChart } from "@/components/admin-dashboard-chart";
import { PaginationComponent } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { Incident } from "@/lib/types/incident";
import { User } from "@/lib/types/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTotalCompanyIncidents, getTotalCompanyOpenIncidents, getTotalCompanyUsers } from "@/lib/helpers/company.helpers";

export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin-login");
  }

  const { accessToken, user } = session;
  const { companyId } = user;
  const { limit = "10", page = "1", search } = await searchParams;

  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  search && params.set("search", search);

  // companies/:companyId/incidents/non-paginated
  const incidentsUrl = `${process.env.BACKEND_URL}/companies/${companyId}/incidents?${params.toString()}`;
  const usersUrl = `${process.env.BACKEND_URL}/companies/${companyId}/users?${params.toString()}`;
  const incidentsCreatedAtUrl = `${process.env.BACKEND_URL}/companies/${companyId}/incidents/created-at`;

  const [incidentResponse, usersResponse, incidentsCreatedAtResponse] = await Promise.all([
    fetch(incidentsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(usersUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(incidentsCreatedAtUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ]);

  const [
    { data: totalCompanyIncidents },
    { data: totalCompanyUsers },
    { data: totalCompanyOpenIncidents }
  ] = await Promise.all([
    await getTotalCompanyIncidents(accessToken, companyId),
    await getTotalCompanyUsers(accessToken, companyId),
    await getTotalCompanyOpenIncidents(accessToken, companyId)
  ])

  if (!incidentResponse.ok || !usersResponse.ok || !incidentsCreatedAtResponse.ok) {
    return (
      <div className="flex min-h-screen flex-col gap-6">
        <BreadCrumb currentPage="Dashboard" />
        <div className="space-y-3">
          <p className="text-2xl font-semibold">Dashboard</p>
          <p className="text-sm text-muted-foreground">
            We could not load the dashboard data. Please refresh and try again.
          </p>
        </div>
      </div>
    );
  }

  const { incidents, meta }: { incidents: Incident[]; meta: { page: number; limit: number; total: number; totalPages: number } } = await incidentResponse.json();
  const { users }: { users: User[] } = await usersResponse.json();
  const incidentsCreatedAtData: { createdAt: string }[] = await incidentsCreatedAtResponse.json()

  console.log("incidents created at data", incidentsCreatedAtData);

  const headers = [
    { label: "Incident ID", key: "incidentIdDisplay" },
    { label: "Category", key: "category" },
    { label: "Created", key: "createdAt" },
    { label: "Deadline", key: "deadlineAt" },
    { label: "Status", key: "status" },
  ];

  const totalIncidents = totalCompanyIncidents;
  const totalMembers = totalCompanyUsers;
  const openIncidents = totalCompanyOpenIncidents;

  const timelineData = incidentsCreatedAtData
    .map(({ createdAt }) => createdAt)
    .reduce<Array<{ date: string; incidents: number }>>((acc, createdAt) => {

      const date = new Date(createdAt as string);
      if (Number.isNaN(date.getTime())) {
        return acc;
      }

      const key = date.toISOString().slice(0, 10);
      const existing = acc.find((item) => item.date === key);
      if (existing) {
        existing.incidents += 1;
      } else {
        acc.push({ date: key, incidents: 1 });
      }

      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex min-h-screen flex-col gap-8">
      <BreadCrumb currentPage="Dashboard" />

      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-foreground/10 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Total incidents</p>
          <p className="mt-3 text-3xl font-semibold">{totalIncidents}</p>
        </div>
        <div className="border border-foreground/10 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Total members</p>
          <p className="mt-3 text-3xl font-semibold">{totalMembers}</p>
        </div>
        <div className="border border-foreground/10 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Open incidents</p>
          <p className="mt-3 text-3xl font-semibold">{openIncidents}</p>
        </div>
      </div>

      <div className="space-y-6 border-t border-foreground/10 pt-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Incidents
          </p>
          <p className="text-lg text-muted-foreground">
            Recent reports and their current status.
          </p>
        </div>

        <SearchInput placeholder="Search incidents..." />
        <TableData path="/admin/incidents" data={incidents} headers={headers} />
        <PaginationComponent meta={meta} />
      </div>

      <div className="space-y-6 border-t border-foreground/10 pt-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Timeline
          </p>
          <p className="text-lg text-muted-foreground">
            Incidents reported over time.
          </p>
        </div>

        <IncidentTimelineChart data={timelineData} />
      </div>
    </div>
  );
}
