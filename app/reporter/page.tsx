import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function ReporterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-20 sm:px-8 lg:px-12">
      <div className="w-full max-w-4xl space-y-10">
        <div className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            SemaFacts
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Report with confidence.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
            SemaFacts is a whistleblowing platform for reporting incidents through companies that are clients of SemaFacts.
            You can submit a new report through the company links provided by SemaFacts, or track an existing report using your
            incident code and secret code.
          </p>
        </div>

        <div className="max-w-3xl space-y-5">
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            Your information is protected on this platform, and you can follow up on your submitted report with the relevant company
            through its incident handlers.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link className="px-2 py-1 bg-black rounded-lg text-white" href="/reporter/track">Track an existing report</Link>
          </div>
        </div>
      </div>
    </div>
  );
}