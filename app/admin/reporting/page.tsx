import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateReportingPageDrawer } from "@/components/update-reporting-page-drawer";
import { Category } from "@/lib/types/category";
import { type ReportingPage } from "@/lib/types/reporting-page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ReportingPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin-login")
    }
    const { accessToken, user } = session;
    const { companyId } = user;

    const url = `${process.env.BACKEND_API_URL}/companies/${companyId}/reporting-page`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb currentPage="Reporting Page" />
                <div className="flex flex-col gap-6">
                    <p className="text-2xl">Reporting Page</p>
                    <p className="text-md font-medium">Could not fetch the reporting page details. Please refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    const {
        categories,
        reportingPage
    }: {
        categories: Category[],
        reportingPage: ReportingPage
    } = await res.json();

    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Reporting Page" />
            <div className="flex flex-col gap-4">
                <p className="text-2xl">Reporting Page</p>
                <Tabs defaultValue="overview" className="flex flex-col gap-4 w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Overview</p>
                                <UpdateReportingPageDrawer data={reportingPage} />
                            </div>

                            <ul className="list-disc pl-4 space-y-2">
                                <li className="text-md">Title: <span className="font-medium">{reportingPage.title ? reportingPage.title : "Not set"}</span></li>
                                <li className="text-md">Reporting page URL: <span className="font-medium">{reportingPage.reportingPageUrl ? reportingPage.reportingPageUrl : "Not set"}</span></li>
                                <li className="text-md">Reporting page introduction: <span className="font-medium">{reportingPage.introContent ? reportingPage.introContent : "Not set"}</span></li>
                                <li className="text-md">Policy URL: <span className="font-medium">{reportingPage.policyUrl ? reportingPage.policyUrl : "Not set"}</span></li>
                            </ul>
                        </div>
                    </TabsContent>
                    <TabsContent value="categories">
                        <div className="flex flex-col gap-6 border-2 border-mist-500 rounded-2xl min-h-screen p-6">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-lg">Categories</p>
                            </div>

                            <ul className="list-disc pl-4 space-y-2">
                                {categories.map((category, index) => <li key={index} className="text-md">{category.categoryName}</li>)}
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}