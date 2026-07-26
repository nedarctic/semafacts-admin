import { Incident } from "../types/incident";

export async function getHandlerIncidents(accessToken: string, url: string): Promise<{
    success: boolean;
    data?: {
        incidents: Incident[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        }
    };
    error?: string;
}> {
    try {        
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data.error || data.message || "Backend request error"
            }
        }

        return {
            success: true,
            data
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

