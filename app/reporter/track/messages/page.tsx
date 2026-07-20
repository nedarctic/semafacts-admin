import { BreadCrumb } from "@/components/breadcrumb";

export default async function MessagesPage() {
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Messages" />
            <p className="font-bold text-xl">Messages</p>
        </div>
    )
}