import { BreadCrumb } from "@/components/breadcrumb";

export default async function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Settings" />
            <p className="font-bold text-xl">Settings</p>
        </div>
    )
}