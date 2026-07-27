import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Confidential intake",
    description:
      "A calm and secure way for employees and partners to raise concerns without friction.",
  },
  {
    title: "Structured follow-up",
    description:
      "Every incident can move through clear ownership, triage, and case handling with transparency.",
  },
  {
    title: "Flexible reporting pages",
    description:
      "Each company experience can be tailored with clear guidance and a consistent tone.",
  },
];

const steps = [
  {
    title: "1. Submit",
    description: "A reporter can start a new case through a company-specific reporting channel.",
  },
  {
    title: "2. Review",
    description: "Handlers and admins receive the report with the structure needed to respond carefully.",
  },
  {
    title: "3. Follow up",
    description: "The reporter can continue the process with confidence through the appropriate company contact.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-14">
        <nav className="flex items-center justify-between border-b border-foreground/10 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">SemaFacts</p>
            <p className="mt-1 text-sm text-muted-foreground">Whistleblowing and incident management</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin-login">
              <Button variant="default" className="min-w-32" size="lg">
                Admin
              </Button>
            </Link>
          </div>
        </nav>

        <section className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Confidential by design
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Transparency for every concern, structure for every response.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              SemaFacts gives organizations a calm, secure way to receive reports and support follow-up with clarity and care.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/reporter-login">
                <Button size="lg" className="w-full sm:w-auto">
                  Track a report
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/admin-login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore admin access
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-8 border-t border-foreground/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                What the platform supports
              </p>
              <div className="space-y-4">
                {highlights.map((item) => (
                  <div key={item.title} className="border-b border-foreground/10 pb-4 last:border-b-0">
                    <p className="text-base font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-foreground/10 py-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              A simple flow
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A single platform for confidential reporting and thoughtful response.
            </h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.title} className="space-y-2 border-t border-foreground/10 pt-4">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-base leading-7 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-foreground/10 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to bring clarity and trust to incident reporting?
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                Whether you are launching a new reporting capability or improving an existing one, SemaFacts helps your team respond with integrity and confidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/reporter-login">
                <Button size="lg">
                  Track a report
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/admin-login">
                <Button variant="outline" size="lg">
                  Go to admin setup
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}