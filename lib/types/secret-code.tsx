import { Incident } from "./incident";

export interface SecretCode {
    id: string;
    incidentId: string;
    secretCodeHash: string;
    createdAt: string;
    incident?: Incident;
}