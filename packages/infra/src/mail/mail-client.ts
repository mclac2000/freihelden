export interface SendMailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface MailClient {
  send(request: SendMailRequest): Promise<void>;
}

