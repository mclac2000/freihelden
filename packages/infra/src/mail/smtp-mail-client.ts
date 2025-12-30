import { MailClient, SendMailRequest } from "./mail-client";

export class SmtpMailClient implements MailClient {
  async send(request: SendMailRequest): Promise<void> {
    // Platzhalter-Implementierung
    // TODO: nodemailer oder Provider anbinden
    console.log("MAIL SENT (placeholder)", request);
  }
}

