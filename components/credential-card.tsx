'use client'

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";

export function CredentialCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    const { copyToClipboard, isCopied } = useCopyToClipboard();

    return (
        <Card>
            <CardContent className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">
                        {label}
                    </p>

                    <code className="font-mono text-lg font-semibold break-all">
                        {value}
                    </code>
                </div>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(value)}
                >
                    {isCopied ? (
                        <CheckIcon className="size-4" />
                    ) : (
                        <CopyIcon className="size-4" />
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}