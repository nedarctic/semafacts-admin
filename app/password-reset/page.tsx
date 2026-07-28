"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { useState, type SubmitEvent } from "react"
import { toast } from "sonner"
import { z } from "zod"

export default function PasswordResetPage() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setLoading(true)
            const validationRes = z.string().email("Invalid email address").safeParse(email)

            if (!validationRes.success) {
                setLoading(false)
                toast.error("Invalid email address.")
                return
            }

            const res = await fetch("/api/users/password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            if (!res.ok) {
                setLoading(false)
                return
            }

            setLoading(false);
            setSubmitted(true);
        } catch {
            setLoading(false)
            toast.error("Service temporarily unavailable. Please try again later")
        }
    }

    return (
        <div className="flex min-h-svh items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md flex flex-col gap-6">
                <div className="mb-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset password</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your work email and we’ll send recovery instructions.
                    </p>
                </div>

                <Card className="border-border/70 bg-background/95 shadow-xl shadow-black/5">
                    <CardHeader className="px-6 pb-4 text-center">
                        <CardTitle className="text-xl">Forgot your password?</CardTitle>
                        <CardDescription>We’ll help you get back in quickly.</CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-6">
                        {!submitted ? (
                            <Form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            required
                                        />
                                        <FieldDescription>
                                            We’ll only use this to send password reset details.
                                        </FieldDescription>
                                    </Field>

                                    <Field>
                                        <Button disabled={loading} type="submit" className="w-full">
                                            {loading ? <Spinner size={8} /> : "Send reset link"}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </Form>
                        ) : (
                            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground">Check your inbox</p>
                                <p>
                                    If an account exists for <span className="font-medium text-foreground">{email}</span>,
                                    we’ll send recovery instructions shortly.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Remembered your password?{" "}
                    <Button onClick={() => router.back()} variant="ghost">
                        Back to sign in
                    </Button>
                </p>
            </div>
        </div>
    )
}
