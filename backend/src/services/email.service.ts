// backend/src/services/sendEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL ?? 'no-reply@ecoride.dedyn.io';
const bcc = process.env.RESEND_BCC_EMAIL ?? 'control@ecoride.dedyn.io';
const contact = process.env.RESEND_CONTACT_EMAIL ?? 'contact@ecoride.dedyn.io';

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to?: string;
  subject: string;
  html: string;
}): Promise<void> => {
  await resend.emails.send({
    from,
    to: to ?? contact,
    bcc,
    subject,
    html,
  });
};
