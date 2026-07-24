import { CreateNewPasswordForm } from "@/components/create-new-password-form";
import { notFound } from "next/navigation";

export default async function InviteVerification({ searchParams }: { searchParams: Promise<{ token: string }> }) {
    const { token } = await searchParams;

    if(!token){
        return notFound()
    }

    return <div className="flex flex-col min-h-screen items-center justify-center">
        <CreateNewPasswordForm token={token} />
    </div>
}