export interface FileAttachment {
  id: string;
  communicationEventId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedAt: string;
  uploadedBy: {
    actorId: string;
    role: string;
  };
}

