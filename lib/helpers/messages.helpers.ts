import { Message } from "../types/message";

export async function getIncidentMessages (accessToken: string, incidentId: string): Promise<{
    success: boolean;
    data?: Message[];
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_URL}/messages/${incidentId}`;
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
                error: data.message
            }
        }

        return {
            success: true,
            data
        }
    } catch (error){
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}