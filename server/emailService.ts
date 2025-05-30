import nodemailer from 'nodemailer';

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'z.charek@gmail.com',
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
    const mailOptions = {
      from: 'z.charek@gmail.com',
      to: 'z.charek@gmail.com',
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

    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès à z.charek@gmail.com');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}