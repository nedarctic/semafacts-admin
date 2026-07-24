"use client"

import { UserStatus } from "@/lib/enums/user-status.enum";
import { FileWarningIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";

export function DeactivateMemberDialog({ memberId }: { memberId: string }) {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const clickHandler = async () => {
        try {
            const url = `/api/users/${memberId}`;
            const res = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({ status: UserStatus.INACTIVE })
            });

            const { success } = await res.json();

            if (!res.ok || !success) {
                setLoading(false);
                setOpen(false);
                toast.error("Failed to deactivate member.");
                return;
            }

            setLoading(false);
            setOpen(false);
            toast.success("Successfully deactivated member");
            router.refresh();
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="ghost"><FileWarningIcon size={16} />Deactivate Member</Button>} />
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Deactivate Member</DialogTitle>
                <DialogDescription>Are you sure you want to deactivate this member? This action will deactivate the member but will be still visible in the organization.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2 justify-end p-2">
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button onClick={clickHandler}
                    variant="destructive">{loading ? <Spinner size={8} /> : "Deactivate"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}