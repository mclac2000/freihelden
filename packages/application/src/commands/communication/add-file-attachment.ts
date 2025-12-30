import { fileAttachmentStore } from "../../state/file-attachment-store";
import { FileAttachment } from "../../../../domain/src/file-attachment";
import { randomUUID } from "crypto";

export function addFileAttachment(
  communicationEventId: string,
  filename: string,
  mimeType: string,
  sizeBytes: number,
  storagePath: string,
  actor: { actorId: string; role: string }
) {
  const attachment: FileAttachment = {
    id: randomUUID(),
    communicationEventId,
    filename,
    mimeType,
    sizeBytes,
    storagePath,
    uploadedAt: new Date().toISOString(),
    uploadedBy: actor
  };

  fileAttachmentStore.add(attachment);
  return attachment;
}

