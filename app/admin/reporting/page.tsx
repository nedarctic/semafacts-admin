import { BreadCrumb } from "@/components/breadcrumb";

export default async function ReportingPage() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Reporting Page" />
            <div>
                <p className="text-2xl">Reporting Page</p>
            </div>
        </div>
    )
}