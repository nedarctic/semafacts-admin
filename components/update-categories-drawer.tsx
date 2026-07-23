"use client"

import { Category } from "@/lib/types/category";
import { PenIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState, SubmitEvent } from "react";
import z from "zod";
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./ui/drawer";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categoriesSchema = z.object({
    categories: z
        .array(
            z.object({
                id: z.string(),
                categoryName: z.string().trim().min(1, "Category name is required"),
            })
        )
        .min(1, "At least one category is required")
        .refine(
            (cats) => {
                const names = cats.map((cat) =>
                    cat.categoryName.trim().toLowerCase()
                );

                return new Set(names).size === names.length;
            },
            {
                message: "Category names must be unique",
            }
        ),
});

export function UpdateCategoriesDrawer({ data }: { data: Category[] }) {
    const router = useRouter();
    const [categories, setCategories] = useState<{ id: string, categoryName: string }[]>(data.length ?
        data.map(({
            createdAt,
            companyId,
            company,
            ...data }) => ({ ...data }) as {
                id: string,
                categoryName: string
            }) :
        [{
            id: crypto.randomUUID(),
            categoryName: "",
        }]);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>({});

    const addField = () => {
        setCategories(prev => [...prev, {
            id: crypto.randomUUID(),
            categoryName: "",
        }]);
    }

    const removeField = (index: number) => {
        setCategories(prev => [...prev].filter((_, id) => id !== index));
        setErrors({})
    }

    const editCategory = (index: number, categoryName: string) => {
        setCategories(prev => {
            const copy = [...prev];
            const category = copy[index];
            category.categoryName = categoryName;
            return copy;
        })
    }

    const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);

            const validationResult = categoriesSchema.safeParse({
                categories
            });

            if (!validationResult.success) {
                setErrors(z.treeifyError(validationResult.error));
                setLoading(false);
                toast.error("Form validation error")
                console.log("validation errors", z.treeifyError(validationResult.error))
                return;
            }

            const url = "/api/categories";
            const res = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify(categories)
            });

            const { success, data, error } = await res.json();

            if (!res.ok) {
                toast.error("Failed to update categories");
                setLoading(false);
            }

            setLoading(false);
            setOpen(false);
            toast.success("Categories updated successfully.")
            router.refresh();
        } catch (error) {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="ghost"><PenIcon size={16} />Edit categories</Button>} />

        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Edit Categories</DrawerTitle>
                <DrawerDescription>Simply add a category by clicking on the add category button. Delete using the remove category button. Edit a category in-place. Submit when done.</DrawerDescription>
            </DrawerHeader>
            <Form onSubmit={submitHandler}
                id="categories-form" className="flex flex-col justify-between flex-1 overflow-y-auto">
                <div className="flex  flex-col gap-2 p-4">
                    {categories.map((category, index) =>
                        <div key={index} className="flex flex-col gap-1">
                            <div className="flex flex-row gap-4">
                                <Input
                                    onChange={e => editCategory(index, e.target.value)}
                                    value={category.categoryName} placeholder={"Category"} />
                                <Button
                                    onClick={() => removeField(index)}
                                    type="button"
                                    variant="destructive"
                                    className="max-w-fit"
                                    disabled={categories.length === 1}
                                ><Trash2Icon size={16} />Remove</Button>
                            </div>
                            <div>
                                {errors?.properties?.categories?.items?.length &&
                                    <ul className="list-disc pl-4">
                                        {errors?.properties?.categories?.items?.[index]?.properties?.categoryName?.errors?.map((error: string, index: number) =>
                                            <li className="text-xs font-medium text-red-600" key={index}>{error}</li>
                                        )}
                                    </ul>
                                }
                            </div>
                        </div>
                    )}
                    {errors?.properties?.categories?.errors?.length &&
                        <ul className="list-disc pl-4">
                            {errors?.properties?.categories?.errors?.map((error: string, index: number) =>
                                <li className="text-xs font-medium text-red-600" key={index}>{error}</li>
                            )}
                        </ul>
                    }
                    <Button
                        variant="secondary"
                        onClick={addField}><PlusIcon size={16} />Add category</Button>
                </div>

            </Form>
            <DrawerFooter>
                <Button type="submit" form="categories-form">{loading ? <Spinner /> : "Update"}</Button>
                <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}