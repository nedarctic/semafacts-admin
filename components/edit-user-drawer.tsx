"use client"

import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
    DrawerClose
} from "./ui/drawer";
import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/enums/user-role.enum";
import { Button } from "./ui/button";
import { PenIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { Spinner } from "./ui/spinner";
import { Form } from "./ui/form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const updateMemberSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Email is required"),
    role: z.enum([
        UserRole.ADMIN,
        UserRole.HANDLER
    ])
});

export function EditUserDrawer({ data }: {
    data: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    }
}) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const [name, setName] = useState<string>(data.name);
    const [email, setEmail] = useState<string>(data.email);
    const [role, setRole] = useState<UserRole>(data.role);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            console.log("name", name, "email", email, "role", role)
            const validatedRes = updateMemberSchema.safeParse({
                name,
                email,
                role
            });

            if (!validatedRes.success) {
                toast.error("Form validation error");
                setErrors(z.treeifyError(validatedRes.error))
                setLoading(false);
            }

            const url = `/api/users/${data.id}`;
            const res = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({
                    name,
                    email,
                    role
                })
            });

            const { success } = await res.json();
            if (!res.ok || !success) {
                toast.error("Failed to update user.");
                setLoading(false);
            }

            setLoading(false);
            setOpen(false);
            toast.success("Successfully updated user.");
            router.refresh();
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerTrigger render={<Button><PenIcon size={16} />Edit user</Button>} />

        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Update user details</DrawerTitle>
            </DrawerHeader>
            <Form onSubmit={submitHandler} className="flex flex-col gap-3 p-4" id="update-member-form">
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input defaultValue={data.name} onChange={e => setName(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input defaultValue={data.email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Select defaultValue={data.role}
                    onValueChange={(value) => setRole(value!)}
                     items={[{ label: "ADMIN", value: UserRole.ADMIN }, { label: "HANDLER", value: UserRole.HANDLER }]}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger>
                            <SelectGroup>
                                <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                                <SelectItem value={UserRole.HANDLER}>HANDLER</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </Form>
            <DrawerFooter>
                <Button type="submit" form="update-member-form">{loading ? <Spinner size={8} /> : "Update"}</Button>
                <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}