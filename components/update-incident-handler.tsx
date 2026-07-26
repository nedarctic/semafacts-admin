"use client"

import { IncidentStatus } from "@/lib/enums/incident-status.enum";
import { Category } from "@/lib/types/category";
import { Incident } from "@/lib/types/incident";
import { PenIcon } from "lucide-react";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Form } from "./ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { Field, FieldLabel } from "./ui/field";
import { statusLabels } from "@/lib/mappers";

export function UpdateIncidentHandlerDrawer({ incident, categories }: { incident: Incident, categories: Category[] }) {

    const router = useRouter();

    const [status, setStatus] = useState<IncidentStatus>(incident.status);
    const [category, setCategory] = useState<string>(incident.category!);

    const [loading, setLoading] = useState<boolean>();
    const [open, setOpen] = useState<boolean>(false);

    const statusItems = Object.values(IncidentStatus).map(status => ({ label: statusLabels[status], value: status }));
    const categoryItems = categories.map(category => ({ label: category.categoryName, value: category.categoryName }))

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const url = `/api/handlers/incidents/${incident.id}`;
            const res = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({
                    status,
                    category
                })
            });

            const { success } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                toast.error("Failed to update incident.");
            }

            setLoading(false);
            setOpen(false);
            router.refresh();
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    };

    return <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="ghost"><PenIcon />Update Incident</Button>} />
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Edit Incident Details</DrawerTitle>
                <DrawerDescription>Update the incidents status or category</DrawerDescription>
            </DrawerHeader>
            <Form onSubmit={submitHandler}
                id="update-incident-form"
                className="flex flex-col p-4 gap-4">
                <Field>
                    <FieldLabel>Incident category</FieldLabel>
                    <Select items={statusItems}
                        defaultValue={status}
                        onValueChange={value => setStatus(value!)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger>
                            <SelectGroup>
                                {Object.values(IncidentStatus).map((status, index) =>
                                    <SelectItem value={status} key={index}>{statusLabels[status]}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel>Incident category</FieldLabel>
                    <Select items={categoryItems}
                        defaultValue={category}
                        onValueChange={value => setCategory(value!)}
                    >
                        <SelectTrigger className="w-45">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger>
                            <SelectGroup>
                                {categories.map((category, index) => (
                                    <SelectItem key={index} value={category.categoryName}>{category.categoryName}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>


            </Form>
            <DrawerFooter>
                <Button type="submit" form="update-incident-form">{loading ? <Spinner size={8} /> : "Update"}</Button>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}