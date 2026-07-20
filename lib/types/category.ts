import { Company } from "./company";

export interface Category {
    id: string;
    companyId: string;
    categoryName: string;
    createdAt: string;
    company: Company;
}