import { BreadCrumb } from "@/components/breadcrumb";

export default async function SupportPage() {
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Support" />
            <p className="font-bold text-xl">Support</p>
        </div>
    )
}