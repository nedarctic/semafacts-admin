import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { InviteHandlerDialog } from "@/components/invite-handler-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/types/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getHandlerIncidents } from "@/lib/helpers/handlers.helpers";
import { UserStatus } from "@/lib/enums/user-status.enum";
import { DeactivateMemberDialog } from "@/components/deactivate-member-dialog";
import { EditUserDrawer } from "@/components/edit-user-drawer";
import { UserRole } from "@/lib/enums/user-role.enum";

export default async function TeamMemberDetailsPage({ params }: {
    params: Promise<{
        teamId: string;
    }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login");
    }
    const { accessToken, user } = session;
    const { id: userId } = user;
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
    const data = {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role
    } as {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    }
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
                                <div className="flex flex-row gap-2">
                                    {member.status !== UserStatus.ACTIVE ?
                                        <InviteHandlerDialog email={member.email} /> :
                                        userId !== member.id ? <DeactivateMemberDialog memberId={member.id} /> : ""}
                                    <EditUserDrawer data={data} />
                                </div>
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