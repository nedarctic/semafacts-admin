import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AddEvidenceDrawer } from "@/components/add-evidence-drawer";
import { BreadCrumb } from "@/components/breadcrumb";
import { Messages } from "@/components/messages";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateIncidentHandlerDrawer } from "@/components/update-incident-handler";
import { AttachmentUploader } from "@/lib/enums/attachment-uploader.enum";
import { SenderType } from "@/lib/enums/sender-type.enum";
import { getCategories } from "@/lib/helpers/categories.helpers";
import { getIncident, getIncidentMessages } from "@/lib/helpers/incidents.helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function IncidentDetailPage({ params }: { params: Promise<{ incidentId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/handler-login")
    }
    const { accessToken, user } = session;
    const { companyId } = user;
    const { incidentId } = await params;

    const { data: incident, success } = await getIncident(accessToken, incidentId);
    const { data: categories } = await getCategories(accessToken, companyId);
    const { data: incidentMessages } = await getIncidentMessages(accessToken, incidentId);

    console.log("incident messages", incidentMessages);
    console.log("categories", categories);

    const crumbs = [
        { label: "Incidents", link: "/handler" }
    ];

    if (!success || !incident) {
        return <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Incident Details" />
            <div className="flex flex-col gap-6">
                <p className="font-bold text-xl">Incident Details</p>
                <p className="text-md font-medium">Details for incident not found. Refresh the page or try again later.</p>
            </div>
        </div>
    }

    const incidentStatus = incident!.status;

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Incident Details" />
            <div className="flex flex-col gap-6">
                <p className="font-bold text-xl">Incident {incident?.incidentIdDisplay}</p>
                <Tabs defaultValue="overview" className="flex flex-col gap-4 w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Overview</p>
                                <UpdateIncidentHandlerDrawer incident={incident!} categories={categories!} />
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
                    <TabsContent value="messages">
                        <div className="flex flex-col gap-6 min-h-screen">
                            <div className="flex flex-col space-y-2">
                                <Messages
                                    userId={user.id}
                                    incidentId={incident?.id!}
                                    senderType={SenderType.Handler}
                                    initialMessages={incidentMessages!}
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="attachments">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Attachments</p>
                                <AddEvidenceDrawer incidentId={incidentId} attachmentUploader={AttachmentUploader.Handler} />
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