import nodemailer from 'nodemailer';

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'centraltestagency@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // We'll need this from the user
  }
});

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  // Check if Gmail credentials are available
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.log('Contact form submission received (Gmail credentials not configured):');
    console.log(`From: ${formData.firstName} ${formData.lastName} (${formData.email})`);
    console.log(`Company: ${formData.company}`);
    console.log(`Service: ${formData.service}`);
    console.log(`Message: ${formData.message}`);
    return false;
  }

  try {
    // Email de notification interne
    const notificationOptions = {
      from: 'centraltestagency@gmail.com',
      to: 'centraltestagency@gmail.com',
      subject: `Nouveau message de contact - ${formData.firstName} ${formData.lastName}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
  <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #2563eb; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
      📧 Nouveau message de contact
    </h2>
    
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
      <h3 style="color: #1e293b; margin-top: 0;">Informations du contact</h3>
      <p style="margin: 8px 0;"><strong>Nom complet:</strong> ${formData.firstName} ${formData.lastName}</p>
      <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #2563eb;">${formData.email}</a></p>
      <p style="margin: 8px 0;"><strong>Entreprise:</strong> ${formData.company}</p>
      <p style="margin: 8px 0;"><strong>Service d'intérêt:</strong> ${formData.service}</p>
    </div>
    
    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
      <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
      <div style="background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap; line-height: 1.6;">
${formData.message}
      </div>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
    <p style="color: #64748b; font-size: 14px; text-align: center;">
      📅 Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}<br>
      🌐 Envoyé depuis le site web Central Test Agency
    </p>
  </div>
</div>
      `,
      text: `
Nouveau message de contact reçu:

Nom: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Entreprise: ${formData.company}
Service d'intérêt: ${formData.service}

Message:
${formData.message}

---
Reçu le ${new Date().toLocaleDateString('fr-FR')} depuis le site Central Test Agency
      `
    };

    // Email de confirmation pour le client
    const confirmationOptions = {
      from: 'centraltestagency@gmail.com',
      to: formData.email,
      subject: 'Confirmation de réception - Central Test Agency',
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
  <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #2563eb; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
      ✅ Message bien reçu !
    </h2>
    
    <p style="color: #1e293b; font-size: 16px; line-height: 1.6;">
      Bonjour <strong>${formData.firstName} ${formData.lastName}</strong>,
    </p>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Nous avons bien reçu votre message concernant <strong>${formData.service}</strong> pour <strong>${formData.company}</strong>. 
      Notre équipe va l'examiner attentivement et vous répondre dans les plus brefs délais.
    </p>
    
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
      <h3 style="color: #1e293b; margin-top: 0;">Récapitulatif de votre demande</h3>
      <p style="margin: 8px 0;"><strong>Service demandé:</strong> ${formData.service}</p>
      <p style="margin: 8px 0;"><strong>Message:</strong></p>
      <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap; line-height: 1.6; color: #4b5563;">
${formData.message}
      </div>
    </div>
    
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1e293b; margin-top: 0;">Prochaines étapes</h3>
      <ul style="color: #4b5563; line-height: 1.6; padding-left: 20px;">
        <li>Notre équipe analyse votre demande</li>
        <li>Nous vous recontactons sous 24-48h ouvrées</li>
        <li>Nous planifions un appel de découverte gratuit</li>
        <li>Nous vous proposons une solution personnalisée</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #4b5563;">
        Des questions en attendant ? Répondez directement à cet email.
      </p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
    <div style="text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
        <strong>Central Test Agency</strong><br>
        Experts en Tests Logiciels & UX
      </p>
      <p style="color: #64748b; font-size: 12px;">
        📧 centraltestagency@gmail.com | 🌐 Site web
      </p>
    </div>
  </div>
</div>
      `,
      text: `
Bonjour ${formData.firstName} ${formData.lastName},

Nous avons bien reçu votre message concernant ${formData.service} pour ${formData.company}.
Notre équipe va l'examiner attentivement et vous répondre dans les plus brefs délais.

Récapitulatif de votre demande:
Service demandé: ${formData.service}
Message: ${formData.message}

Prochaines étapes:
- Notre équipe analyse votre demande
- Nous vous recontactons sous 24-48h ouvrées
- Nous planifions un appel de découverte gratuit
- Nous vous proposons une solution personnalisée

Des questions en attendant ? Répondez directement à cet email.

---
Central Test Agency
Experts en Tests Logiciels & UX
📧 centraltestagency@gmail.com
      `
    };

    // Envoyer les deux emails
    await Promise.all([
      transporter.sendMail(notificationOptions),
      transporter.sendMail(confirmationOptions)
    ]);

    console.log('Emails envoyés avec succès - notification interne et confirmation client');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    return false;
  }
}