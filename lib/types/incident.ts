import { Attachment } from "./attachment";
import { Company } from "./company";
import { IncidentHandler } from "./incident-handler";
import { Message } from "./message";
import { Reporter } from "./reporter";
import { SecretCode } from "./secret-code";

export interface Incident {
    id: string;
    companyId: string;
    incidentIdDisplay: string;
    category?: string;
    description?: string;
    location?: string;
    involvedPeople?: string;
    incidentDate?: string;
    reporterType: ReporterType;
    status: IncidentStatus;
    secretCodeHash: string;
    deadlineAt?: string;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
    duration?: string;
    attachments?: Attachment[],
    handlers?: IncidentHandler[],
    company?: Company,
    messages?: Message[]
    reporter?: Reporter;
    secretCode?: SecretCode[]
}