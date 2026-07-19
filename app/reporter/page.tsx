import { CreateIncidentForm } from "@/components/create-incident-form";

export default async function ReporterHomePage () {
    return (
        <div className="flex flex-col min-h-screen p-6">
            <p className="font-bold text-xl">Reporter</p>
            <CreateIncidentForm />
        </div>
    )
}