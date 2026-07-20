import { Incident } from "./incident";
import { User } from "./user";

export interface IncidentHandler {
    id: string;
    incidentId: string;
    handlerId: string;
    assignedAt: string;
    handler?: User;
    incident?: Incident;
}