import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AddEvidenceDrawer } from "@/components/add-evidence-drawer";
import { BreadCrumb } from "@/components/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateIncidentHandlerDrawer } from "@/components/update-incident-handler";
import { AttachmentUploader } from "@/lib/enums/attachment-uploader.enum";
import { getCategories } from "@/lib/helpers/categories.helpers";
import { getIncident } from "@/lib/helpers/incidents.helpers";
import { statusLabels } from "@/lib/mappers";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
    const { success: categoriesSuccess, data: categories } = await getCategories(accessToken, companyId);

    console.log("categories", categories);

    const crumbs = [
        { label: "Incidents", link: "/handler" }
    ];

    if (!success) {
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
                            <div className="flex flex-col gap-2">
                                <ul className="list-disc pl-4 space-y-2">
                                    <li className="text-md">Status: <span className="font-medium">{statusLabels[incident?.status as keyof typeof statusLabels]}</span></li>
                                    <li className="text-md">Incident ID: <span className="font-medium">{incident?.incidentIdDisplay}</span></li>
                                    <li className="text-md">Category: <span className="font-medium">{incident?.category}</span></li>
                                    <li className="text-md">Description: <span className="font-medium">{incident?.description}</span></li>
                                    <li className="text-md">Location: <span className="font-medium">{incident?.location}</span></li>
                                    <li className="text-md">Duration: <span className="font-medium">{incident?.duration}</span></li>
                                    <li className="text-md">People involved: <span className="font-medium">{incident?.involvedPeople}</span></li>
                                    <li className="text-md">Date: <span className="font-medium">{incident?.incidentDate}</span></li>
                                    <li className="text-md">Reporter type: <span className="font-medium">{incident?.reporterType}</span></li>
                                    <li className="text-md">Created: <span className="font-medium">{new Date(incident?.createdAt!).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}</span></li>
                                    <li className="text-md">Deadline: <span className="font-medium">{incident?.deadlineAt ? new Date(incident?.deadlineAt!).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }) : "Not set"}</span></li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="messages">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Messages</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {incident?.messages?.length ? <ul className="list-disc pl-4">
                                    {incident?.messages?.map((message, index) => <li key={index} className="font-medium">{message?.content}</li>)}
                                </ul> : <p className="font-semibold text-md">No conversation on this incident yet.</p>}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="attachments">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Attachments</p>
                                <AddEvidenceDrawer incidentId={incidentId} attachmentUploader={AttachmentUploader.Handler} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <ul className="flex flex-col gap-3 list-decimal pl-4">
                                    {incident?.attachments?.map((attachment, index) =>
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