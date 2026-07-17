import { BreadCrumb } from "@/components/breadcrumb";

export default async function SettingsPage() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Settings" />
            <div>
                <p className="text-2xl">Settings</p>
            </div>
        </div>
    )
}