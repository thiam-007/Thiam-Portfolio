import * as SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// Configure API key
// @ts-ignore
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY.includes('placeholder')) {
    console.warn('⚠️  Brevo API key not configured - email not sent');
    return false;
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Portfolio Cheick Ahmed Thiam',
      email: process.env.ADMIN_EMAIL || 'noreply@cheickthiam.com',
    };

    sendSmtpEmail.to = [{ email: options.to }];
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.htmlContent;

    if (options.textContent) {
      sendSmtpEmail.textContent = options.textContent;
    }

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully to ${options.to}`);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

// Template pour notification de contact
export const sendContactNotification = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  date: Date;
}): Promise<boolean> => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('❌ ADMIN_EMAIL not configured');
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0a192f; color: #cca354; padding: 20px; text-align: center; }
        .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #0a192f; }
        .value { margin-top: 5px; }
        .footer { margin-top: 20px; text-align: center; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 Nouveau Message de Contact</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">De:</div>
            <div class="value">${contactData.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Sujet:</div>
            <div class="value">${contactData.subject}</div>
          </div>
          <div class="field">
            <div class="label">Date:</div>
            <div class="value">${contactData.date.toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short'
  })}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value" style="white-space: pre-wrap; background-color: white; padding: 15px; border-left: 4px solid #cca354;">${contactData.message}</div>
          </div>
        </div>
        <div class="footer">
          <p>Ce message a été envoyé depuis votre portfolio</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Nouveau Message de Contact

De: ${contactData.name}
Email: ${contactData.email}
Sujet: ${contactData.subject}
Date: ${contactData.date.toLocaleString('fr-FR')}

Message:
${contactData.message}
  `;

  return sendEmail({
    to: adminEmail,
    subject: `📬 Nouveau contact: ${contactData.subject}`,
    htmlContent,
    textContent,
  });
};

// Template pour accusé de réception automatique
export const sendAutoReply = async (contactData: {
  name: string;
  email: string;
}): Promise<boolean> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #cca354; text-decoration: none; }
        .content { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .h1 { color: #0a192f; margin-top: 0; }
        .footer { margin-top: 30px; text-align: center; color: #888; font-size: 13px; }
        .button { display: inline-block; background-color: #cca354; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">Cheick Ahmed Thiam</a>
        </div>
        <div class="content">
          <h1 class="h1">Merci pour votre message !</h1>
          <p>Bonjour ${contactData.name},</p>
          <p>J'ai bien reçu votre message via mon formulaire de contact. Je vous remercie de l'intérêt que vous portez à mon profil.</p>
          <p>Je prendrai le temps de lire votre demande et je m'engage à vous répondre dans un délai de <strong>24 heures</strong>.</p>
          <p>En attendant, n'hésitez pas à consulter mes derniers projets ou à me suivre sur LinkedIn.</p>
          <br>
          <p>Cordialement,<br><strong>Cheick Ahmed Thiam</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Cheick Ahmed Thiam. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Bonjour ${contactData.name},

J'ai bien reçu votre message et je vous en remercie.

Je m'engage à vous répondre dans un délai de 24 heures.

Cordialement,
Cheick Ahmed Thiam
  `;

  return sendEmail({
    to: contactData.email,
    subject: `Réception de votre message - Cheick Ahmed Thiam`,
    htmlContent,
    textContent,
  });
};

export default { sendEmail, sendContactNotification, sendAutoReply };
