import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AddEvidenceDrawer } from "@/components/add-evidence-drawer";
import { BreadCrumb } from "@/components/breadcrumb";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttachmentUploader } from "@/lib/enums/attachment-uploader.enum";
import { Attachment } from "@/lib/types/attachment";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AttachmentsPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/reporter-login")
    }
    const { incidentId, accessToken } = session;

    const url = `${process.env.BACKEND_URL}/incidents/${incidentId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const incident = await res.json();
    const { attachments }: { attachments: Attachment[] } = incident;
    console.log("attachments", attachments);

    console.log("incident ID", incidentId)

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Attachments" />
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-xl">Incident Attachments</p>
                <AddEvidenceDrawer incidentId={incidentId!} attachmentUploader={AttachmentUploader.Reporter} />
            </div>
            {attachments ?
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Evidence Type</TableHead>
                            <TableHead>Uploaded By</TableHead>
                            <TableHead>Date Uploaded</TableHead>
                        </TableRow>
                        {attachments.map((attachment, index) => <TableRow key={index}>
                            <TableCell>{attachment.mimeType}</TableCell>
                            <TableCell>{attachment.uploadedBy}</TableCell>
                            <TableCell>{new Date(attachment.createdAt).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                        </TableRow>)}
                    </TableHeader>
                </Table> :
                <p className="font-semibold text-md">No attachments to this incident yet.</p>
            }
        </div>
    )
}