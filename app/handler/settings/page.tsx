import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { getUser } from "@/lib/helpers/users.helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/handler-login")
    }
    const { user, accessToken } = session;

    console.log("user id", user.id);

    const { data, success } = await getUser(accessToken, user.id);

    console.log("user data", data);

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Settings" />
            <p className="font-bold text-xl">Settings</p>
        </div>
    )
}