'use client'

import { toast } from "sonner";
import { Form } from "./ui/form";
import { useState, SubmitEvent, useRef } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import z from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Spinner } from "./ui/spinner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Group, GroupSeparator } from "./ui/group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";

enum ReporterType {
    Anonymous = "Anonymous",
    Confidential = "Confidential"
}

const evidenceFileSchema = z.instanceof(File)
    .optional()
    .refine(file => !file || file);

const createIncidentSchema = z.object({
    reporterType: z.enum(ReporterType),
    category: z.string().min(1, "Please select a category for this incident"),
    description: z.string().min(1, "Please provide a description of the incident"),
    location: z.string().min(1, "Please provide the location where the incident occurred"),
    involvedPeople: z.string().min(1, "Plese provide us with the information on who was involved in the incident"),
    incidentDate: z.string().min(1, "Plese provide a date on when the incident occurred"),
    duration: z.string().min(1, "Plese tell us how long the incident occurred"),
    evidenceFiles: z.array(z.instanceof(File).optional()
        .refine(file => !file || [
            // Images
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',

            // Audio
            'audio/mpeg',
            'audio/wav',
            'audio/ogg',
            'audio/mp4',

            // Video
            'video/mp4',
            'video/mpeg',
            'video/webm',
            'video/quicktime',

            // Documents
            'application/pdf',

            // Word
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

            // Excel
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

            // PowerPoint
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',

            // Text
            'text/plain',
            'text/csv',
        ].includes(file.type), { message: "Unsupported file type." })),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().regex(
        /^\+?[1-9]\d{7,14}$/,
        "Invalid phone number"
    ).optional()
});

export function CreateIncidentForm({ companyId }: { companyId: string }) {

    const { copyToClipboard, isCopied } = useCopyToClipboard();

    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [involvedPeople, setInvolvedPeople] = useState<string>('');
    const [incidentDate, setIncidentDate] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
    const [reporterType, setReporterType] = useState<ReporterType>(ReporterType.Anonymous);
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();

    const categories = [
        { label: "Sexual harrassment", value: "Sexual harrassment" }
    ];
    const [code, setCode] = useState<string>('');
    const [secretCode, setSecretCode] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const inputRef = useRef<HTMLInputElement>(null);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {

            setLoading(true);
            setOpen(true);
            const validatedResult = createIncidentSchema.safeParse({
                reporterType,
                category,
                description,
                location,
                involvedPeople,
                incidentDate,
                duration,
                evidenceFiles,
                name,
                email,
                phone
            });

            if (!validatedResult.success) {
                const error = validatedResult.error;
                console.error("Validation error", error);
                toast.error("Validation error");
                setOpen(false);
                setErrors(z.treeifyError(error));
                setLoading(false);
                return;
            }

            const formData = new FormData();

            formData.append("reporterType", reporterType);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("location", location);
            formData.append("involvedPeople", involvedPeople);
            formData.append("incidentDate", incidentDate);
            formData.append("duration", duration);
            name && formData.append("name", name);
            email && formData.append("email", email);
            phone && formData.append("phone", phone);

            if (evidenceFiles.length) {
                for (const file of evidenceFiles) {
                    formData.append("attachments", file)
                }
            }

            for (const [key, value] of formData.entries()) {
                console.log('Key:', key, "Value:", value);
            }

            const url = `/api/incidents/${companyId}`;
            const res = await fetch(url, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("An error occurred creating incident", data);
                toast.error("Could not report incident");
                setOpen(false);
                setLoading(false);
                return;
            };

            setCode(code);
            setSecretCode(secretCode);
            setLoading(false);
            console.log("Code:", data.code);
            console.log("Secret code:", data.secretCode);
            setOpen(false);

        } catch (error) {
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return (
        <Form onSubmit={submitHandler} className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-6 my-4">
                <Card onClick={e => setReporterType(ReporterType.Anonymous)}
                    className={`cursor-pointer ${reporterType === "Anonymous" ? "ring-2 ring-black cursor-pointer" : ""}`}>
                    <CardHeader>
                        <CardTitle>Report Anonymously</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>I would like to report anonymously</CardDescription>
                    </CardContent>
                </Card>
                <Card onClick={e => setReporterType(ReporterType.Confidential)}
                    className={`cursor-pointer ${reporterType === "Confidential" ? "ring-2 ring-black" : ""}`}>
                    <CardHeader>
                        <CardTitle>Report Confidentially</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>I would like to report anonymously</CardDescription>
                    </CardContent>
                </Card>
            </div>
            <Field>
                <FieldLabel>Incident category</FieldLabel>
                <Select items={categories} value={category} onValueChange={value => setCategory(value!)}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Selct a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {categories.map((category, index) => (
                                <SelectItem key={index} value={category.value}>{category.label}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>
            <Field>
                <FieldLabel>Describe what happened, including dates, locations, and any relevant details.</FieldLabel>
                <Textarea required onChange={e => setDescription(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>Where did the incident occur?</FieldLabel>
                <Input required onChange={e => setLocation(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>Names, roles, or departments involved (if known)</FieldLabel>
                <Input required onChange={e => setInvolvedPeople(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>When did this incident occur?</FieldLabel>
                <Input required type="date" onChange={e => setIncidentDate(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>How long has this occurred?</FieldLabel>
                <Input required onChange={e => setDuration(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>Attach evidence files if any</FieldLabel>
                <Input type="file" multiple onChange={e => {
                    const files = e.target.files as FileList;
                    console.log(files);
                    setEvidenceFiles(prev => [...prev, ...files])
                }} />
            </Field>

            {reporterType === "Confidential" ? <div className="rounded-2xl ring-black ring-2 p-6 flex flex-col gap-4">
                <Field>
                    <FieldLabel>Full name</FieldLabel>
                    <Input required onChange={e => setName(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input required onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Phone number (optional)</FieldLabel>
                    <Input required onChange={e => setPhone(e.target.value)} />
                </Field>
            </div> : ""}
            <Button type="submit">Submit</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{loading ? "Reporting Incident..." : "Copy report trackingcredentials"}</DialogTitle>
                        {loading ? <Spinner className="size-8" /> :
                            (code && secretCode) ?
                                <div className="flex flex-col gap-2">

                                    <p>Code: <Group aria-label="incident-code">
                                        <Input
                                            aria-label="Incident Code"
                                            defaultValue={code}
                                            ref={inputRef}
                                            type="text"
                                        />
                                        <GroupSeparator />
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <Button
                                                        aria-label="Copy"
                                                        onClick={() => {
                                                            if (inputRef.current) {
                                                                copyToClipboard(inputRef.current.value);
                                                            }
                                                        }}
                                                        size="icon"
                                                        variant="outline"
                                                    />
                                                }
                                            >
                                                {isCopied ? <CheckIcon /> : <CopyIcon />}
                                            </TooltipTrigger>
                                            <TooltipPopup>
                                                <p>Copy to clipboard</p>
                                            </TooltipPopup>
                                        </Tooltip>
                                    </Group></p>

                                    <p>Secret code: <Group aria-label="incident-secret-code">
                                        <Input
                                            aria-label="Incident Secret Code"
                                            defaultValue={secretCode}
                                            ref={inputRef}
                                            type="text"
                                        />
                                        <GroupSeparator />
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <Button
                                                        aria-label="Copy"
                                                        onClick={() => {
                                                            if (inputRef.current) {
                                                                copyToClipboard(inputRef.current.value);
                                                            }
                                                        }}
                                                        size="icon"
                                                        variant="outline"
                                                    />
                                                }
                                            >
                                                {isCopied ? <CheckIcon /> : <CopyIcon />}
                                            </TooltipTrigger>
                                            <TooltipPopup>
                                                <p>Copy to clipboard</p>
                                            </TooltipPopup>
                                        </Tooltip>
                                    </Group></p>

                                </div> :
                                <p className="font-bold text-sm text-red-600">An error occurred.</p>
                        }
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button>OK</Button>} />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Form>
    );
}