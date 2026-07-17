"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useId, useState, useTransition } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"

type LoginFormProps = React.ComponentProps<"div"> & {
  userType: "Handler" | "Admin"
};

export function LoginForm({
  className,
  userType,
  ...props
}: LoginFormProps) {

  const router = useRouter();
  const id = useId();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isVisible, setIsVisible] = useState(false);

  const loginHandler = async (e: React.SubmitEvent) => {
    e.preventDefault();

    startTransition(async () => {

      setError("");
      const res = await signIn(userType === "Admin" ? "admin-access" : "handler-access", {
        email,
        password,
        redirect: false,
        callbackUrl: userType === "Admin" ? "/admin" : "/handler/incidents",
      });

      if (res?.error == "CredentialsSignin") {
        setError("Wrong email or password");
        return;
      }

      router.push(userType === "Admin" ? (res?.url || "/admin") : "/handler/incidents");
    });

  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your E-mail and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                 <InputGroup>
                  <InputGroupInput
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
              </Field>
              {error && <p className="text-red-600 font-normal text-sm">{error}</p>}
              <Field>
                <Button type="submit">{isPending ? "Signing in..." : "Sign in"}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
