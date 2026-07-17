import { BreadCrumb } from "@/components/breadcrumb";

export default async function TeamPage() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BreadCrumb currentPage="Team" />
            <div>
                <p className="text-2xl">Team</p>
            </div>
        </div>
    )
}