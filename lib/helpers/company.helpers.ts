export async function getTotalCompanyIncidents(
    accessToken: string,
    companyId: string,
): Promise<{
    success: boolean;
    data?: number;
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_URL}/companies/${companyId}/total-incidents`;
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
                error: data.message || "Backend request error"
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

export async function getTotalCompanyUsers(
    accessToken: string,
    companyId: string,
): Promise<{
    success: boolean;
    data?: number;
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_URL}/companies/${companyId}/total-users`;
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
                error: data.message || "Backend request error"
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

export async function getTotalCompanyOpenIncidents(
    accessToken: string,
    companyId: string,
): Promise<{
    success: boolean;
    data?: number;
    error?: string;
}> {
    try {
        const url = `${process.env.BACKEND_URL}/companies/${companyId}/total-open-incidents`;
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
                error: data.message || "Backend request error"
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