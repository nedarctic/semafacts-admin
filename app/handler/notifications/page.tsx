import { BreadCrumb } from "@/components/breadcrumb";

export default async function NotificationsPage() {
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Notifications" />
            <p className="font-bold text-xl">Notifications</p>
        </div>
    )
}