import { BreadCrumb } from "@/components/breadcrumb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export default async function IncidentTrackingPage() {
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
    console.log("Incident", incident);

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Incident Details" />
            <p className="font-bold text-xl">Incident Tracking Page</p>

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
    )
}
