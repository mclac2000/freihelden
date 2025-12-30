import { communicationStore } from "../../state/communication-store";
import { MailClient } from "../../../../infra/src/mail/mail-client";
import { randomUUID } from "crypto";

export async function sendEmail(
  mailClient: MailClient,
  entityType: "LEAD" | "CUSTOMER",
  entityId: string,
  to: string,
  subject: string,
  body: string,
  actor: { actorId: string; role: string }
) {
  await mailClient.send({ to, subject, body });

  communicationStore.add({
    id: randomUUID(),
    type: "EMAIL_SENT",
    entityType,
    entityId,
    content: `To: ${to}\nSubject: ${subject}\n\n${body}`,
    createdAt: new Date().toISOString(),
    createdBy: actor
  });
}
