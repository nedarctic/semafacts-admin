export interface Attachment {
    id: string;
    createdAt: Date;
    incidentId: string;
    uploadedBy: AttachmentUploader;
    fileKey: string;
    fileUrl: string;
    mimeType: string | null;
}