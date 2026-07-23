import { Category } from "../types/category";

export async function getCategories (accessToken: string, companyId: string): Promise<{
    success: boolean;
    data?: Category[];
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_URL}/categories/${companyId}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!res.ok){
            return {
                success: false,
                error: res.statusText
            }
        }

        const data = await res.json();
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