import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadCrumb } from "@/components/breadcrumb";
import { Messages } from "@/components/messages";
import { SenderType } from "@/lib/enums/sender-type.enum";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MessagesPage() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/reporter-login")
    }
    const { incidentId, accessToken, user } = session;

    const url = `${process.env.BACKEND_URL}/incidents/${incidentId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const incident = await res.json();
    const { messages } = incident;

    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Messages" />
            <p className="font-bold text-xl">Messages</p>
            <div className="flex flex-col space-y-2">
                <Messages
                    incidentId={incident?.id!}
                    senderType={SenderType.Reporter}
                    initialMessages={messages}
                />
            </div>
        </div >
    )
}