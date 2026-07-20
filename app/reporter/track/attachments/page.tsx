import { BreadCrumb } from "@/components/breadcrumb";

export default async function AttachmentsPage() {
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Attachments" />
            <p className="font-bold text-xl">Incident Attachments</p>
        </div>
    )
}