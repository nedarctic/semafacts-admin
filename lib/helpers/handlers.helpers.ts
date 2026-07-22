import { Incident } from "../types/incident";

export async function getHandlerIncidents (accessToken: string, handlerId: string): Promise<{
    success: boolean;
    data?: Incident[];
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_API_URL}/handlers/${handlerId}/incidents`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await res.json();

        if(!res.ok){
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

