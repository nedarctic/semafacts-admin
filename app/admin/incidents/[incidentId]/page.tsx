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
import { AttachmentUploader } from "@/lib/enums/attachment-uploader.enum";
import { MessagesAdminComponent } from "@/components/messages-admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function IncidentDetailsPage({ params }: { params: Promise<{ incidentId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login");
    }
    const { accessToken, user } = session;
    const { companyId } = user;
    const { incidentId } = await params;

    const url = `${process.env.BACKEND_URL}/incidents/${incidentId}`;

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
    console.log("incident handlers", incident.handlers);

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
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableCell>{incident.status}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Incident ID</TableHead>
                                        <TableCell>{incident.incidentIdDisplay}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableCell>{incident.category}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableCell>{incident.description}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Location</TableHead>
                                        <TableCell>{incident.location}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Duration</TableHead>
                                        <TableCell>{incident.duration}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>People Involved</TableHead>
                                        <TableCell>{incident.involvedPeople}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableCell>{incident.incidentDate}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Reporter Type</TableHead>
                                        <TableCell>{incident.reporterType}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Created</TableHead>
                                        <TableCell>{new Date(incident.createdAt!).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Deadline</TableHead>
                                        <TableCell>{new Date(incident.deadlineAt!).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="handlers">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Handlers</p>
                                <AssignHandlersDrawer incidentId={incidentId} nonIncidentHandlers={nonIncidentHandlers!} />
                            </div>

                            {incident.handlers?.length ?
                                <Table>
                                    <TableBody>
                                        {incident.handlers?.map((handler, index) => <TableRow key={index} className="font-medium"><TableCell>{handler?.handler?.name!}</TableCell></TableRow>)}
                                    </TableBody>
                                </Table>
                                :
                                <p className="font-semibold text-md">No handlers assigned to this incident yet.</p>}

                        </div>
                    </TabsContent>
                    <TabsContent value="messages">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Messages</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {incident.messages?.length ? <MessagesAdminComponent messages={incident.messages} /> : <p className="font-semibold text-md">No conversation on this incident yet.</p>}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="attachments">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Attachments</p>
                                <AddEvidenceDrawer incidentId={incidentId} attachmentUploader={AttachmentUploader.SuperAdmin} />
                            </div>

                            {incident.attachments ?
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Evidence Type</TableHead>
                                            <TableHead>Uploaded By</TableHead>
                                        </TableRow>
                                        {incident.attachments.map((attachment, index) => <TableRow key={index}>
                                            <TableCell>{attachment.mimeType}</TableCell>
                                            <TableCell>{attachment.uploadedBy}</TableCell>
                                        </TableRow>)}
                                    </TableHeader>
                                </Table> :
                                <p className="font-semibold text-md">No attachments to this incident yet.</p>
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}