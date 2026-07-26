"use client"

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { PenIcon } from "lucide-react";
import { Form } from "./ui/form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export function UpdateUserHandlerDrawer({ data }: { data: { id: string, name: string, email: string } }) {
    const router = useRouter();

    const [name, setName] = useState<string>(data.name);
    const [email, setEmail] = useState<string>(data.email)

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(false);
            const url = `/api/users/${data.id}`;
            const res = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email
                })
            });

            if (!res.ok) {
                setLoading(false);
                toast.error("Failed to update user details.")
                return;
            }

            setLoading(false);
            setOpen(false);
            router.refresh();

        } catch (error) {
            setLoading(false);
            setOpen(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerTrigger render={<Button variant="ghost"><PenIcon size={16} />Edit details</Button>} />
        <DrawerContent>
            
            <DrawerHeader>
                <DrawerTitle>Edit details</DrawerTitle>
            </DrawerHeader>

            <Form className="flex flex-col gap-3 p-4"
                onSubmit={submitHandler} id="user-update-form">
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input value={name} onChange={e => setName(e.target.value)} type="text" />
                </Field>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" onChange={e => setEmail(e.target.value)} value={email} />
                </Field>
            </Form>
            
            <DrawerFooter>
                <Button type="submit" form="user-update-form">{loading ? <Spinner size={8} /> : "Update"}</Button>
                <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>

        </DrawerContent>
    </Drawer>
}