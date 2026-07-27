import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { PaginationComponent } from "@/components/pagination";
import { getCompanyAuditLogs } from "@/lib/helpers/audit-logs.helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminNotificationsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect(`${process.env.BACKEND_URL}/admin-login`);
    }

    const { user, accessToken } = session;
    const { companyId } = user;
    const { page = "1", limit = "10" } = await searchParams;

    const { success, data: companyAuditLogs, error } = await getCompanyAuditLogs(
        accessToken,
        companyId,
        Number(page),
        Number(limit)
    );

    return (
        <div className="flex min-h-screen flex-col gap-8">
            <BreadCrumb currentPage="Notifications" />

            <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Overview
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Notifications</h1>
            </div>

            <div className="space-y-6 border-t border-foreground/10 pt-8">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Audit logs
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Review recent account activity for your company.
                    </p>
                </div>

                {!success ? (
                    <p className="text-lg text-muted-foreground">
                        {error || "Could not load the audit logs. Please try again later."}
                    </p>
                ) : !companyAuditLogs?.auditLogs?.length ? (
                    <p className="text-lg text-muted-foreground">No audit logs found.</p>
                ) : (
                    <div className="space-y-3">
                        {companyAuditLogs.auditLogs.map((item) => (
                            <div key={item.id} className="border border-foreground/10 p-4 sm:p-5">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{item.log}</p>
                                        <p className="text-sm leading-7 text-muted-foreground">{item.details}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {companyAuditLogs?.meta ? (
                    <PaginationComponent meta={companyAuditLogs.meta} />
                ) : null}
            </div>
        </div>
    );
}