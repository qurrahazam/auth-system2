import { Resend } from "resend";

export async function resendEmail(email: string, subject_: string, html_: string, token: string, emailKind: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetLink = `${process.env.FRONTEND_URL}/${emailKind}?token=${token}`;
    await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: subject_,
    html: html_.replace("{RESET_LINK}", resetLink),
    });
}
