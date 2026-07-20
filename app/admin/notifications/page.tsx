import { BreadCrumb } from "@/components/breadcrumb";

export default async function AdminNotificationsPage() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Notifications" />
            <div>
                <p className="text-2xl">Notifications</p>
            </div>
        </div>
    )
}