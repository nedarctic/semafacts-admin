"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PlusIcon } from "lucide-react"
import { Form } from "./ui/form"
import { Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { useState, SubmitEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"

export function AddHandlerDrawer({ companyId }: { companyId: string }) {

  const router = useRouter();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler = async (e: SubmitEvent) => {
    e.preventDefault();

    try {

      setLoading(true);
      const url = `/api/users`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, companyId })
      });

      const { success, error, data } = await res.json();

      if (!res.ok) {
        setLoading(false);
        setOpen(false);
        toast.error("Failed to add new member");
        console.log(error);
        return;
      }

      setLoading(false);
      setOpen(false);
      toast.success("Successfully added the team member");
      router.refresh();

    } catch (error) {
      setLoading(false);
      setOpen(false);
      toast.error("Service temporarily unavailable. Please try again later.")
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerTrigger render={<Button variant="ghost"><PlusIcon size={16} />Add Handler</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Handler</DrawerTitle>
          <DrawerDescription>This does not automatically give them access to manage the incidents. They will still have to be invited and accept the invite to begin managing incidents.</DrawerDescription>
        </DrawerHeader>
        <Form onSubmit={submitHandler} className="flex flex-col gap-2 justify-between h-full">
          <div className="flex flex-col gap-2 p-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" required onChange={e => setName(e.target.value)} placeholder="Name" />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input id="email" type="email" required placeholder="Email" onChange={e => setEmail(e.target.value)} />
            </Field>
          </div>
          <DrawerFooter>
            <Button type="submit" variant="default">{loading ? <Spinner size={8} /> : "Add Handler"}</Button>
            <DrawerClose render={<Button variant="outline">Close</Button>} />
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
