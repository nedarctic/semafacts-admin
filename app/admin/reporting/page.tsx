import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { ReportingPageTable } from "@/components/reporting-page-table";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateCategoriesDrawer } from "@/components/update-categories-drawer";
import { UpdateReportingPageDrawer } from "@/components/update-reporting-page-drawer";
import { getCategories } from "@/lib/helpers/categories.helpers";
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

    const url = `${process.env.BACKEND_URL}/companies/${companyId}/reporting-page`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const { data: categories } = await getCategories(accessToken, companyId);
    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col gap-6">
                <BreadCrumb currentPage="Reporting Page" />
                <div className="flex flex-col gap-6">
                    <p className="text-2xl">Reporting Page</p>
                    <p className="text-md">Could not fetch the reporting page details. Please refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    const {
        reportingPage
    }: {
        reportingPage: ReportingPage
    } = await res.json();

    const reportingPageUrl = `${process.env.FRONTEND_URL}/reporter/${reportingPage.reportingPageUrl}`

    return (
        <div className="flex min-h-screen flex-col gap-8">
            <BreadCrumb currentPage="Reporting Page" />

            <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Overview
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reporting Page</h1>
            </div>

            <div className="space-y-6 border-t border-foreground/10 pt-8">
                <Tabs defaultValue="overview" className="flex w-full flex-col gap-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Details
                            </p>
                            <UpdateReportingPageDrawer data={reportingPage} />
                        </div>
                        <ReportingPageTable reportingPage={reportingPage} reportingPageUrl={reportingPageUrl} />
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Categories
                            </p>
                            <UpdateCategoriesDrawer data={categories!} />
                        </div>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableHead>Categories</TableHead>
                                </TableRow>
                                {categories?.map((category, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{category.categoryName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}