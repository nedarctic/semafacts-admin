import { BreadCrumb } from "@/components/breadcrumb";

export default async function AccountPage() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Account" />
            <div>
                <p className="text-2xl">Account</p>
            </div>
        </div>
    )
}