import { CreateIncidentForm } from "@/components/create-incident-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyByReportingPage } from "@/lib/helpers/company.helpers";
import { notFound } from "next/navigation";

export default async function ReporterHomePage({ params }: { params: Promise<{ reportingUrl: string }> }) {
    const { reportingUrl } = await params;
    const { data: company, success, error } = await getCompanyByReportingPage(reportingUrl);

    if (!success || !company) {
        return notFound();
    }

    const companyInitials = company.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex flex-col items-center min-h-screen w-full px-6 py-10 gap-6">
            <div className="w-full max-w-5xl space-y-6">
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-border/70 bg-muted text-2xl font-semibold text-foreground">
                                {company.logoUrl ? (
                                    <img
                                        src={company.logoUrl}
                                        alt={`${company.name} logo`}
                                        className="h-full w-full rounded-3xl object-cover"
                                    />
                                ) : (
                                    companyInitials
                                )}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{company.name}</CardTitle>
                                <CardDescription>
                                    Submit an incident report directly to the {company.name} reporting page.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-border/70 bg-background p-4">
                            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Reporting slug</p>
                            <p className="mt-2 font-semibold break-all">{company.reportingLinkSlug ?? reportingUrl}</p>
                        </div>
                        <div className="rounded-3xl border border-border/70 bg-background p-4">
                            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">SLA window</p>
                            <p className="mt-2 font-semibold">{company.slaDays ?? "N/A"} days</p>
                        </div>
                        <div className="rounded-3xl border border-border/70 bg-background p-4">
                            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Privacy</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Reports are routed to the company’s incident team for review.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col items-center w-full">
                    <CreateIncidentForm companyId={company.id} />
                </div>
            </div>
        </div>
    );
}