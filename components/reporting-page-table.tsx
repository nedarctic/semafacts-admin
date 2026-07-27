"use client"

import { ReportingPage } from "@/lib/types/reporting-page"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table"
import { CheckCheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

export function ReportingPageTable({ reportingPage, reportingPageUrl }: { reportingPage: ReportingPage, reportingPageUrl: string }) {

    const [isCopied, setIsCopied] = useState<boolean>(false);

    return <Table className="cursor-pointer">
        <TableBody>
            <TableRow>
                <TableHead className="w-32">Title</TableHead>
                <TableCell>{reportingPage.title ? reportingPage.title : "Not set"}</TableCell>
            </TableRow>
            <TableRow>
                <TableHead className="w-32">Page URL</TableHead>
                <TableCell onClick={() => {
                    navigator.clipboard.writeText(reportingPageUrl);
                    setIsCopied(!isCopied);
                    toast.success("Copied!");
                }} className="flex flex-row items-center gap-3">{reportingPageUrl ? reportingPageUrl : "Not set"} <CopyIcon size={16} /></TableCell>
            </TableRow>
            <TableRow>
                <TableHead className="w-32">Introduction</TableHead>
                <TableCell>{reportingPage.introContent ? reportingPage.introContent : "Not set"}</TableCell>
            </TableRow>
            <TableRow>
                <TableHead className="w-32">Policy URL</TableHead>
                <TableCell>{reportingPage.policyUrl ? reportingPage.policyUrl : "Not set"}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
}