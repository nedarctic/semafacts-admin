import { Company } from "./company";

export interface ReportingPage {
    id: string;
    companyId: string;
    title?: string;
    introContent?: string;
    policyUrl?: string;
    reportingPageUrl?: string;
    company?: Company;
}