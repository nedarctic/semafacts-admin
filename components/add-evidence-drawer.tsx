"use client"

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { 
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerTrigger, 
    DrawerDescription,
    DrawerFooter
} from "./ui/drawer";
import { DialogClose } from "./ui/dialog";
import { Form } from "./ui/form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState, SubmitEvent } from "react";

export function AddEvidenceDrawer() {
    const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    return <Drawer swipeDirection="right">
        <DrawerTrigger render={<Button variant="ghost"><PlusIcon size={16} />Upload new evidence</Button>} />
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Upload new evidence</DrawerTitle>
                <DrawerDescription>The system will notify the handler for this incident of the new evidence upload.</DrawerDescription>
            </DrawerHeader>
            <Form className="p-4">
                <Field>
                    <FieldLabel>New Evidence</FieldLabel>
                    <Input type="file" multiple onChange={e => {
                        const files = e.currentTarget.files;

                        setEvidenceFiles(prev => [...prev, ...files!])
                    }} />
                </Field>
            </Form>
            <DrawerFooter>
                <Button>Add evidence</Button>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}