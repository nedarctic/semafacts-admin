"use client"

import { User } from "@/lib/types/user";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "./ui/drawer";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

export function AssignHandlersDrawer({ nonIncidentHandlers }: { nonIncidentHandlers: User[] }) {
    const router = useRouter();

    const [email, setEmail] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    console.log("email", email);

    const clickHandler = async () => {
        try {
            setLoading(true);
            const url = `/api/invites`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            if (!res.ok) {
                setLoading(false);
                setOpen(false);
                toast.error("Failed to invite member");
            }
            setLoading(false);
            setOpen(false);
            toast.success("Invite successfully sent. Once the handler accepts the invite, they will be listed under handlers for this incident.");
            router.refresh();
        } catch (error) {
            setLoading(false);
            setOpen(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerTrigger render={<Button variant="ghost"><PlusIcon size={16} />Assign New Handler</Button>} />
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Assign New Handler</DrawerTitle>
            </DrawerHeader>
            <RadioGroup
                value={email}
                onValueChange={setEmail}
                className="space-y-3 p-4"
            >
                {nonIncidentHandlers.map((handler) => {
                    const id = `handler-${handler.email}`;

                    return (
                        <div
                            key={handler.email}
                            className="flex items-center gap-1"
                        >
                            <RadioGroupItem
                                id={id}
                                value={handler.email}
                            />
                            <label
                                htmlFor={id}
                                className="cursor-pointer"
                            >
                                {handler.name}
                            </label>
                        </div>
                    );
                })}
            </RadioGroup>
            <DrawerFooter>
                <Button onClick={clickHandler}>{loading ? <Spinner size={8} /> : "Send Invite"}</Button>
                <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}