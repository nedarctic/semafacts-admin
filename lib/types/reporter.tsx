import { Incident } from "./incident";
import { Message } from "./message";

export interface Reporter {
    id: string;
    incidentId: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt: string;
    messages: Message[]
    incident: Incident;
}