export interface Message {
    id: string;
    createdAt: Date;
    incidentId: string;
    senderType: SenderType;
    content: string;
    reporterId: string | null;
    userId: string | null;
}