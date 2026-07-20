"use client"

import { useState } from "react";
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";

export function ReporterLogoutDialog() {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut({
                callbackUrl: "/reporter-login",
                redirect: true,
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="ghost"><LogOutIcon size={16} />Logout</Button>} />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Logout</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to logout?
                </DialogDescription>
                <div className="flex flex-row gap-2 justify-end">
                    <DialogClose render={<Button>Cancel</Button>} />
                    <Button onClick={handleLogout} 
                    variant="destructive">{loading ? <Spinner size={8} /> : "Logout"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}