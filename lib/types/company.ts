export interface Company {
    id: string;
    name: string;
    reportingLinkSlug: string | null;
    slaDays: string;
    logoKey: string | null;
    logoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};