import { AuditLog } from "../types/audit-log";

export async function getCompanyAuditLogs(
    accessToken: string,
    companyId: string,
    page = 1,
    limit = 10
): Promise<{
    success: boolean;
    data?: {
        auditLogs: AuditLog[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        }
    }
    error?: string;
}> {
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        const url = `${process.env.BACKEND_URL}/companies/${companyId}/audit-logs?${params.toString()}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            return {
                success: false,
                error: data?.message || res.statusText || "Backend error",
            };
        }

        const data = await res.json();
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}