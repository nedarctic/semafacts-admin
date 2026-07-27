import { CreateIncidentForm } from "@/components/create-incident-form";
import { getCompanyByReportingPage } from "@/lib/helpers/company.helpers";
import { notFound } from "next/navigation";

export default async function ReporterHomePage({ params }: { params: Promise<{ reportingUrl: string }> }) {
    const { reportingUrl } = await params;
    console.log("reporting page url", reportingUrl)
    const { data: company, success, error } = await getCompanyByReportingPage(reportingUrl);

    console.log("fetching company data", company, "success", false, "error", error)
    if (!success || !company) {
        return notFound();
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full px-6 py-10 gap-6">
            <p className="font-bold text-xl">Report an Incident</p>
            <div className="flex flex-col items-center w-10/12">
                <CreateIncidentForm companyId={company.id} />
            </div>
        </div>
    )
}