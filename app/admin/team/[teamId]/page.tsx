import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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

    const url = `${process.env.BACKEND_API_URL}/users/${teamId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb currentPage="Team Member Details" />
                <div>
                    <p className="text-2xl">Team Member Details</p>
                    <p className="font-medium text-md">Could not fetch the member's data. Refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    const data = await res.json();

    console.log("data", data);

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Team Member Details" />
            <div className="flex flex-col gap-4">
                <p className="text-2xl">Team Member Details</p>
                <Tabs defaultValue="overview" className="flex flex-col gap-4 w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="handlers">Incidents</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Overview</p>
                            </div>

                        </div>
                    </TabsContent>
                    <TabsContent value="handlers">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Handlers</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}