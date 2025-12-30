import { FileAttachment } from "../../../domain/src/file-attachment";

const attachments: FileAttachment[] = [];

export const fileAttachmentStore = {
  add(attachment: FileAttachment) {
    attachments.push(attachment);
  },
  getByCommunicationEvent(communicationEventId: string) {
    return attachments.filter(
      a => a.communicationEventId === communicationEventId
    );
  },
  getAll(): FileAttachment[] {
    return [...attachments];
  },
  reset() {
    attachments.length = 0;
  }
};
