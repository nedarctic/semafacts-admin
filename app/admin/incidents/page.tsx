import { BreadCrumb } from "@/components/breadcrumb";

export default async function IncidentsPage() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Incidents" />
            <div>
                <p className="text-2xl">Incidents</p>
            </div>
        </div>
    )
}