"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { SubmitEvent, useId, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { Form } from "./ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Spinner } from "./ui/spinner"

const passwordSchema = z.object({
    password: z.string()
        .trim()
        .min(8, "Password must contain at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().trim().min(1, "Password confirmation is required")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export function CreateNewPasswordForm({ token }: { token: string }) {

    const id = useId();
    const router = useRouter();

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const validationResult = passwordSchema.safeParse({
                password,
                confirmPassword
            });

            if (!validationResult.success) {
                setLoading(false);
                setErrors(z.treeifyError(validationResult.error));
                toast.error("Form validation error.")
                return;
            }

            const url = `/api/invites/verify?token=${token}`;
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    password
                })
            });

            const { success, error } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                toast.error("Failed to change password.", { description: error });
                return;
            }

            setLoading(false);
            toast.success("Password changed successfully.");
            router.push("/handler-login");
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return (
        <Card className="w-full max-w-md p-4">
            <Form className="flex flex-col gap-3" onSubmit={submitHandler}>
                <h1 className="text-md font-medium">Create a new password</h1>
                <Field>
                    <FieldLabel>Password</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            aria-invalid={!!errors?.properties?.password?.errors?.length}
                            aria-describedby={`${id}-description`}
                            id={id}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type={isVisible ? "text" : "password"}
                            name="password"
                        />
                        <InputGroupAddon align="inline-end">
                            <Button
                                aria-label={isVisible ? "Hide password" : "Show password"}
                                onClick={() => setIsVisible(!isVisible)}
                                size="icon-xs"
                                variant="ghost"
                                type="button"
                            >
                                {isVisible ? (
                                    <EyeOffIcon aria-hidden="true" />
                                ) : (
                                    <EyeIcon aria-hidden="true" />
                                )}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    {errors?.properties?.password?.errors?.length && <ul className="list-disc">
                        {errors.properties.password.errors.map((error: string, index: number) =>
                            <FieldError key={index}>{error}</FieldError>)}
                    </ul>}
                </Field>
                <Field data-invalid={errors?.properties?.confirmPassword?.errors?.length}>
                    <FieldLabel>Confirm password</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            aria-invalid={!!errors?.properties?.confirmPassword?.errors?.length}
                            aria-describedby={`${id}-description`}
                            id={id}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Password"
                            type={isVisible ? "text" : "password"}
                            name="password"
                        />
                        <InputGroupAddon align="inline-end">
                            <Button
                                aria-label={isVisible ? "Hide password" : "Show password"}
                                onClick={() => setIsVisible(!isVisible)}
                                size="icon-xs"
                                variant="ghost"
                                type="button"
                            >
                                {isVisible ? (
                                    <EyeOffIcon aria-hidden="true" />
                                ) : (
                                    <EyeIcon aria-hidden="true" />
                                )}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    {errors?.properties?.confirmPassword?.errors?.length && <ul className="list-disc">
                        {errors.properties.confirmPassword.errors.map((error: string, index: number) =>
                            <FieldError key={index}>{error}</FieldError>)}
                    </ul>}
                </Field>
                <div className="flex flex-row gap-2">
                    <Checkbox checked={isVisible} onCheckedChange={setIsVisible} /><p className="text-md">Show password</p>
                </div>
                <Button type="submit">{loading ? <Spinner size={8} /> : "Change password"}</Button>
            </Form>
        </Card>
    )
}