import { SenderType } from "../enums/sender-type.enum";

export interface Message {
    id?: string;
    createdAt?: Date;
    incidentId: string;
    senderType: SenderType;
    content: string;
    reporterId?: string;
    userId?: string;
}