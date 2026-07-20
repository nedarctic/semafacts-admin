import { BreadCrumb } from "@/components/breadcrumb";

export default async function IncidentsPage() {
    return (
        <div className="flex flex-col min-h-screen gap-6 p-6">
            <BreadCrumb currentPage="Incidents" />
            <p className="font-bold text-xl">Incidents</p>
        </div>
    )
}