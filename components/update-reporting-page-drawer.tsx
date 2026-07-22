"use client"

import { ReportingPage } from "@/lib/types/reporting-page";
import { PenIcon } from "lucide-react";
import { useState, SubmitEvent } from "react";
import z from "zod";
import { Button } from "./ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Form } from "./ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Spinner } from "./ui/spinner";

const updateReportingPageSchema = z.object({
    title: z.string().optional(),
    reportingPageUrl: z.string().optional(),
    introContent: z.string().optional(),
    policyUrl: z.string().optional(),
})

export function UpdateReportingPageDrawer({ data }: { data: ReportingPage }) {

    const router = useRouter();

    const [title, setTitle] = useState<string>(data.title!);
    const [reportingPageUrl, setReportingPageUrl] = useState<string>(data.reportingPageUrl!);
    const [introContent, setIntroContent] = useState<string>(data.introContent!);
    const [policyUrl, setPolicyUrl] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({})

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const validatedResult = updateReportingPageSchema.safeParse({});

            if (!validatedResult.success) {
                setErrors(z.treeifyError(validatedResult.error));
                setLoading(false);
                return;
            }

            const url = `/api/reporting-page`;
            const res = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({
                    title,
                    reportingPageUrl,
                    introContent,
                    policyUrl
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("Failed to update the reporting page");
                setLoading(false);
                console.log("error updating reporting page:", data)
                return;
            }

            setLoading(false);
            setOpen(false);
            toast.success("Successfully updated the reporting page")
            router.refresh();
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.");
        }
    }

    return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerTrigger render={<Button variant="ghost"><PenIcon size={16} />Edit Reporting Page</Button>} />
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Edit Reporting Page</DrawerTitle>
            </DrawerHeader>
            <Form onSubmit={submitHandler} className="flex flex-col justify-between p-4 h-full">
                <FieldGroup>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input onChange={e => setTitle(e.target.value)} placeholder="Page Title" type="text" />
                    </Field>
                    <Field>
                        <FieldLabel>Reporting Page URL</FieldLabel>
                        <Input onChange={e => setReportingPageUrl(e.target.value)} placeholder="Reporting page URL" type="text" />
                    </Field>
                    <Field>
                        <FieldLabel>Policy URL</FieldLabel>
                        <Input onChange={e => setPolicyUrl(e.target.value)} placeholder="Policy URL" type="text" />
                    </Field>
                    <Field>
                        <FieldLabel>Introduction</FieldLabel>
                        <Textarea onChange={e => setIntroContent(e.target.value)} placeholder="Introduction" />
                    </Field>
                </FieldGroup>
                <DrawerFooter>
                    <Button type="submit">{loading ? <Spinner size={8} />: "Update"}</Button>
                    <DrawerClose render={<Button variant="outline">Cancel</Button>} />
                </DrawerFooter>
            </Form>
        </DrawerContent>
    </Drawer>
}