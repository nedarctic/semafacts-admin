"use client"

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerDescription,
    DrawerFooter
} from "./ui/drawer";
import { DialogClose } from "./ui/dialog";
import { Form } from "./ui/form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState, SubmitEvent } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import z from "zod";
import { ALLOWED_MIME_TYPES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { AttachmentUploader } from "@/lib/enums/attachment-uploader.enum";

const uploadEvidenceSchema = z.object({
    attachments: z.array(
        z.instanceof(File)
            .refine(file => ALLOWED_MIME_TYPES.includes(file.type), { message: "Unsupported format" })
        , "Provide at least one evidence file to submit").min(1, "Add at least one attachment")
});

export function AddEvidenceDrawer({ incidentId }: { incidentId: string }) {
    const router = useRouter();

    const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const submitHandler = async (e: SubmitEvent) => {

        e.preventDefault();
        try {
            setLoading(true);

            const validatedResult = uploadEvidenceSchema.safeParse({
                attachments: evidenceFiles
            });

            if (!validatedResult.success) {
                const error = validatedResult.error;
                setErrors(z.treeifyError(error))
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("uploadedBy", AttachmentUploader.SuperAdmin);

            for (const evidenceFile of evidenceFiles) {
                formData.append("attachments", evidenceFile);
            }

            const url = `/api/attachments/${incidentId}`;
            const res = await fetch(url, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                setLoading(false);
                toast.error("Failed to upload attachments");
                return;
            }

            const { success, error, data } = await res.json();

            if (!success || error) {
                setLoading(false);
                toast.error("Failed to upload attachments")
                console.log(error);
                return;
            }

            setLoading(false);
            setOpen(false);
            setErrors({});
            toast.error("Successfully uploaded more evidence.")
            console.log("upload evidence data", data)
            router.refresh();
        } catch (error) {
            setLoading(false);
            setOpen(false);
            setErrors({});
            toast.error("Service temporarily unavailable. Please try again later.");
            console.log("error uploading attachments", error)
        }
    }

    return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerTrigger render={<Button variant="ghost"><PlusIcon size={16} />Upload new evidence</Button>} />
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Upload new evidence</DrawerTitle>
                <DrawerDescription>The system will notify the handler for this incident of the new evidence upload.</DrawerDescription>
            </DrawerHeader>
            <Form onSubmit={submitHandler} className="flex flex-col justify-between h-full">
                <Field className="p-4">
                    <FieldLabel>New Evidence</FieldLabel>
                    <Input type="file" multiple onChange={e => {
                        const files = e.currentTarget.files;

                        setEvidenceFiles(prev => [...prev, ...files!])
                    }} />
                    {errors?.properties?.attachments?.errors?.length && <ul className="list-disc pl-4">
                        {errors.properties.attachments.errors.map((error: string, index: number) =>
                            <li className="text-red-600 font-bold text-sm" key={index}>{error}</li>)}
                    </ul>}
                </Field>

                <DrawerFooter>
                    <Button type="submit">{loading ? <Spinner size={8} /> : "Add evidence"}</Button>
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                </DrawerFooter>
            </Form>
        </DrawerContent>
    </Drawer>
}