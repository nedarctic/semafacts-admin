import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { InviteHandlerDialog } from "@/components/invite-handler-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/types/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getHandlerIncidents } from "@/lib/helpers/handlers.helpers";

export default async function TeamMemberDetailsPage({ params }: {
    params: Promise<{
        teamId: string;
    }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login");
    }
    const { accessToken } = session;
    const { teamId } = await params;

    const url = `${process.env.BACKEND_URL}/users/${teamId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const { success, data: handlerIncidents, error } = await getHandlerIncidents(accessToken, teamId);

    const crumbs = [
        { label: "Team", link: "/admin/team" }
    ]

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb crumbs={crumbs} currentPage="Team Member Details" />
                <div>
                    <p className="text-2xl">Team Member Details</p>
                    <p className="font-medium text-md">Could not fetch the member's data. Refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    const member: User = await res.json();

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Team Member Details" />
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between w-full">
                    <p className="text-2xl">Team Member Details</p>

                </div>
                <Tabs defaultValue="overview" className="flex flex-col gap-4 w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="incidents">Incidents</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Overview</p>
                                <InviteHandlerDialog email={member.email} />
                            </div>
                            <div>
                                <ul className="list-disc pl-4">
                                    <li className="text-md">Name: <span className="font-semibold">{member.name}</span></li>
                                    <li className="text-md">Email: <span className="font-semibold">{member.email}</span></li>
                                    <li className="text-md">Status: <span className="font-semibold">{member.status}</span></li>
                                    <li className="text-md">Role: <span className="font-semibold">{member.role}</span></li>
                                </ul>
                            </div>

                        </div>
                    </TabsContent>
                    <TabsContent value="incidents">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Incidents</p>
                            </div>
                            <div>
                                {handlerIncidents?.length ? <ul className="list-decimal pl-4">
                                    {handlerIncidents?.map((incident, index) => <li key={index}>
                                        <div>
                                            <p className="text-md">ID: <span className="font-semibold">{incident.incidentIdDisplay}</span></p>
                                            <p className="text-md">Category: <span className="font-semibold">{incident.category}</span></p>
                                            <p className="text-md">Status: <span className="font-semibold">{incident.status}</span></p>
                                        </div>
                                    </li>)}
                                </ul> : <p>No incidents assigned to this handler yet.</p>}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}