export async function getUser (accessToken: string, userId: string) {
    try {
        const url = `${process.env.BACKEND_URL}/users/${userId}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data = await res.json();
        
        if(!res.ok){
            return {
                success: false,
                error: data.message || "Backend error"
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