"use client"

import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";

export function InviteHandlerDialog({ email }: { email: string }) {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleInviteMember = async () => {
        try {
            setLoading(true);

            const url = "/api/invites";
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const { success, error, data } = await res.json();

            if (!res.ok) {
                setLoading(false);
                toast.error("Failed to invite member", {
                    description: error
                });
                return;
            }

            setLoading(false);
            toast.success("Invite successfully sent. Once the member accepts it they will have access to incidents to manage.");
            router.refresh();

        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Dialog>
        <DialogTrigger render={<Button variant="ghost"><PlusIcon size={16} />Invite Member</Button>} />
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
            </DialogHeader>
            <DialogDescription>This action will send an email to the member if they are not active on the system.</DialogDescription>
            <div className="flex flex-row justify-end gap-2">
                <DialogClose render={<Button>Cancel</Button>} />
                <Button variant="secondary" onClick={handleInviteMember}>{loading ? <Spinner size={8} /> : "Yes, Invite"}</Button>
            </div>
        </DialogContent>
    </Dialog>
}