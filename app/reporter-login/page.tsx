import ReporterLoginForm from "@/components/reporter-login-form";

export default async function ReporterLoginPage () {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 max-w-md text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Track your incident</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    To view the status of your report, enter the incident code and secret code provided when you submitted your incident.
                </p>
            </div>
            <ReporterLoginForm />
        </div>
    )
}