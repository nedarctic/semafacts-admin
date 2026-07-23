import { IncidentHandler } from "../types/incident-handler";
import { Message } from "../types/message";
import { User } from "../types/user";

export async function getNonIncidentHandlers(
    accessToken: string,
    incidentId: string,
    companyId: string
): Promise<{
    success: boolean;
    data?: User[];
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_URL}/incidents/${incidentId}/${companyId}/non-handlers`;

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

export async function getIncidentHandlers(
    accessToken: string,
    incidentId: string
): Promise<{ success: boolean; data?: IncidentHandler[]; error?: string }> {
    try {
        const url = `${process.env.BACKEND_URL}/incidents/${incidentId}/handlers`;
        
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

export async function getIncidentMessages(
    accessToken: string,
    incidentId: string
): Promise<{
    success: boolean;
    data?: Message[];
    error?: string;
}> {
    try {

        const url = `${process.env.BACKEND_URL}/incidents/${incidentId}/messages`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await res.json();
        
        if (!res.json) {
            return {
                success: false,
                error: data.message || data.error || "Backend request error"
            }
        }

        return {
            success: true,
            data
        };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}
