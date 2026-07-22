import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Incident } from "@/lib/types/incident";
import { IncidentHandler } from "@/lib/types/incident-handler";
import { Message } from "@/lib/types/message";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getNonIncidentHandlers } from "@/lib/helpers/incidents.helpers";
import { AssignHandlersDrawer } from "@/components/assign-handlers-drawer";
import { AddEvidenceDrawer } from "@/components/add-evidence-drawer";

export default async function IncidentDetailsPage({ params }: { params: Promise<{ incidentId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login");
    }
    const { accessToken, user } = session;
    const { companyId } = user;
    const { incidentId } = await params;

    const url = `${process.env.BACKEND_API_URL}/incidents/${incidentId}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const crumbs = [
        { label: "Incidents", link: "/admin/incidents" }
    ];

    const { success, data: nonIncidentHandlers, error } = await getNonIncidentHandlers(accessToken, incidentId, companyId)

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb crumbs={crumbs} currentPage="Incident Details" />
                <div className="flex flex-col gap-6">
                    <p className="font-bold text-xl">Incident Details</p>
                    <p className="text-md font-medium">Details for incident not found. Refresh the page or try again later.</p>
                </div>
            </div>
        );
    };

    const incident: Incident = await res.json();

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Incident Details" />
            <div className="flex flex-col gap-6">
                <p className="font-bold text-xl">Incident Details</p>
                <Tabs defaultValue="overview" className="flex flex-col gap-4 w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="handlers">Handlers</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Overview</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <ul className="list-disc pl-4 space-y-2">
                                    <li className="text-md">Status: <span className="font-medium">{incident.status}</span></li>
                                    <li className="text-md">Incident ID: <span className="font-medium">{incident.incidentIdDisplay}</span></li>
                                    <li className="text-md">Category: <span className="font-medium">{incident.category}</span></li>
                                    <li className="text-md">Description: <span className="font-medium">{incident.description}</span></li>
                                    <li className="text-md">Location: <span className="font-medium">{incident.location}</span></li>
                                    <li className="text-md">Duration: <span className="font-medium">{incident.duration}</span></li>
                                    <li className="text-md">People involved: <span className="font-medium">{incident.involvedPeople}</span></li>
                                    <li className="text-md">Date: <span className="font-medium">{incident.incidentDate}</span></li>
                                    <li className="text-md">Reporter type: <span className="font-medium">{incident.reporterType}</span></li>
                                    <li className="text-md">Created: <span className="font-medium">{new Date(incident.createdAt).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}</span></li>
                                    <li className="text-md">Deadline: <span className="font-medium">{incident.deadlineAt ? new Date(incident.deadlineAt!).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }) : "Not set"}</span></li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="handlers">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Handlers</p>
                                <AssignHandlersDrawer nonIncidentHandlers={nonIncidentHandlers!} />
                            </div>
                            <div className="flex flex-col space-y-2">
                                {incident.handlers?.length ? <ul className="list-disc pl-4">
                                    {incident.handlers?.map((handler, index) => <li key={index} className="font-medium">{handler?.handler?.name!}</li>)}
                                </ul> : <p className="font-semibold text-md">No handlers assigned to this incident yet.</p>}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="messages">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Messages</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {incident.messages?.length ? <ul className="list-disc pl-4">
                                    {incident.messages?.map((message, index) => <li key={index} className="font-medium">{message?.content}</li>)}
                                </ul> : <p className="font-semibold text-md">No conversation on this incident yet.</p>}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="attachments">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Attachments</p>
                                <AddEvidenceDrawer incidentId={incidentId} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <ul className="flex flex-col gap-3 list-decimal pl-4">
                                    {incident.attachments?.map((attachment, index) =>
                                        <li key={index}>
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    className="text-semibold"
                                                    target="_blank"
                                                    href={attachment.fileUrl}>{attachment.mimeType} attachment
                                                </Link>
                                                <p className="text-md">Uploaded by <span className="text-md font-medium">{attachment.uploadedBy}</span></p>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}