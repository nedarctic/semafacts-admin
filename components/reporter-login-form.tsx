'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, useId } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitEvent } from "react";

export default function ReporterLoginForm() {

  const router = useRouter();
  const id = useId();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [secretCode, setSecretCode] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("code", code, "secret", secretCode);
      const res = await signIn("reporter-access", {
        code,
        secretCode,
        redirect: false,
        callbackUrl: "/reporter/track",
      });
      
      if (res?.error == "CredentialsSignin") {
        setLoading(false);
        toast.error("Wrong email or password");
        return;
      }

      setLoading(false);
      router.push("/reporter/track");
    } catch (error) {
      toast.error("Service temporarily unavailable. Please try again later.")
    }
  }

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Track Incident</CardTitle>
        <CardDescription>Provide your code and secret code to securely track your incident</CardDescription>
      </CardHeader>
      <CardContent>
        <Form 
        onSubmit={submitHandler}
        className="flex w-full flex-col gap-4">
          <Field>
            <FieldLabel>Incident Code</FieldLabel>
            <Input onChange={e => setCode(e.target.value)} type="text" placeholder="Incident code" />
          </Field>
          <Field>
            <FieldLabel>Secret Code</FieldLabel>
            <InputGroup>
              <InputGroupInput
                aria-describedby={`${id}-description`}
                id={id}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Secret code"
                type={isVisible ? "text" : "password"}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  aria-label={isVisible ? "Hide secret code" : "Show secret code"}
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
          <Button 
          disabled={loading}
          className="w-full" type="submit">
            { loading ? "Loading..." : "Track incident"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
