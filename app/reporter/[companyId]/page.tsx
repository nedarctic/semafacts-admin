import { CreateIncidentForm } from "@/components/create-incident-form";

export default async function ReporterHomePage({params}: {params: Promise<{companyId: string}>}) {
    
    const {companyId} = await params; // "f023b0da-6811-4790-aff0-0a5988f0ca9c"
    
    return (
        <div className="flex flex-col items-center min-h-screen w-full px-6 py-10 gap-6">
            <p className="font-bold text-xl">Report an Incident</p>
            <div className="flex flex-col items-center w-10/12">
                <CreateIncidentForm companyId={companyId} />
            </div>
        </div>
    )
}