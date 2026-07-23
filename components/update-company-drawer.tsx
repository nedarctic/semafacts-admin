"use client"

import { useState, SubmitEvent } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/button";
import { PenIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { Form } from "./ui/form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";

const updateCompanySchema = z.object({
    slaDays: z.string()
        .trim()
        .min(1, "SLA days is required")
        .transform(value => Number(value))
        .pipe(z.number().positive())
        .transform(value => String(value)),
    name: z.string().trim().min(1, "Company name is required"),
    logo: z.instanceof(File)
        .optional()
        .refine(file => !file || file.size < 10 * 1024 * 1024, { message: "Max allowed file size is 10MB" })
        .refine(file => !file || ["image/png", "image/jpeg"].includes(file.type), { message: "Allowed file types are PNG and JPG only" })
});

export function UpdateCompanyDrawer(
    { data }: {
        data: {
            slaDays: string;
            name: string;
            logoUrl?: string | null;
        },
    }) {

    const router = useRouter();
    const [name, setName] = useState(data.name);
    const [slaDays, setSlaDays] = useState<string>(data.slaDays);
    const [logo, setLogo] = useState<File>();

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true);

            const validationRes = updateCompanySchema.safeParse({
                name,
                slaDays,
                logo
            });

            if (!validationRes.success) {
                setErrors(z.treeifyError(validationRes.error));
                setLoading(false);
                toast.error("Form validation error");
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("slaDays", slaDays);
            logo && formData.append("logo", logo);

            const url = "/api/companies";
            const res = await fetch(url, {
                method: "PATCH",
                body: formData
            });

            if (!res.ok) {
                toast.error("Failed to update company data");
                setLoading(false);
            }

            setLoading(false);
            setOpen(false);
            setErrors({})
            toast.success("Update successful!")
            router.refresh();
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }
    return <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="ghost"><PenIcon size={16} />Edit company details</Button>} />

        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Edit company details</DrawerTitle>
            </DrawerHeader>
            <Form onSubmit={submitHandler} className="flex flex-col gap-3 p-4 overflow-y-auto" id="company-update-form">
                <Field>
                    <FieldLabel>Company name</FieldLabel>
                    <Input onChange={e => setName(e.target.value)} value={name} />
                    {errors?.properties?.name?.errors?.length && <ul
                        className="list-disc pl-4">{errors.properties.name.errors.map((error: string, index: number) =>
                            <li key={index} className="text-xs text-red-600 font-medium">{error}</li>)}</ul>}
                </Field>
                <Field>
                    <FieldLabel>SLA days</FieldLabel>
                    <Input onChange={e => setSlaDays(e.target.value)} value={slaDays} />
                    {errors?.properties?.slaDays?.errors?.length && <ul
                        className="list-disc pl-4">{errors.properties.slaDays.errors.map((error: string, index: number) =>
                            <li key={index} className="text-xs text-red-600 font-medium">{error}</li>)}</ul>}
                </Field>
                {data.logoUrl ? <h1 className="flex flex-col gap-2">Company Logo</h1> : ""}
                {data.logoUrl ? <div className="relative aspect-square max-w-xl">
                    <Image src={data.logoUrl} fill unoptimized className="rounded-md" alt="Company logo" />
                </div> : ""}
                <Field>
                    <FieldLabel>Logo</FieldLabel>
                    <Input onChange={e => {
                        const file = e.currentTarget.files?.[0];
                        setLogo(file);
                    }} type="file" accept="image/png, image/jpeg" />
                    {errors?.properties?.logo?.errors?.length && <ul
                        className="list-disc pl-4">{errors.properties.logo.errors.map((error: string, index: number) =>
                            <li key={index} className="text-xs text-red-600 font-medium">{error}</li>)}</ul>}
                </Field>

            </Form>
            <DrawerFooter className="p-4">
                <Button type="submit" form="company-update-form">{loading ? <Spinner /> : "Update"}</Button>
                <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}