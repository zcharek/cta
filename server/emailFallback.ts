interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

export async function logContactSubmission(formData: ContactFormData): Promise<boolean> {
  // Log to console with clear formatting for easy monitoring
  console.log('\n🔔 NEW CONTACT FORM SUBMISSION');
  console.log('================================');
  console.log(`👤 Contact: ${formData.firstName} ${formData.lastName}`);
  console.log(`📧 Email: ${formData.email}`);
  console.log(`🏢 Company: ${formData.company}`);
  console.log(`🛠️  Service: ${formData.service}`);
  console.log(`📝 Message: ${formData.message}`);
  console.log(`⏰ Time: ${new Date().toLocaleString('fr-FR')}`);
  console.log('================================\n');
  
  return true;
}

// Enhanced Gmail function with better error handling
export async function sendGmailNotification(formData: ContactFormData): Promise<boolean> {
  try {
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.default.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'centraltestagency@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Test connection first
    await transporter.verify();

    // Send notification email
    await transporter.sendMail({
      from: 'centraltestagency@gmail.com',
      to: 'centraltestagency@gmail.com',
      subject: `Nouveau contact: ${formData.firstName} ${formData.lastName}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Entreprise:</strong> ${formData.company}</p>
        <p><strong>Service:</strong> ${formData.service}</p>
        <p><strong>Message:</strong><br>${formData.message}</p>
      `
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: 'centraltestagency@gmail.com',
      to: formData.email,
      subject: 'Confirmation - Central Test Agency',
      html: `
        <h2>Message bien reçu!</h2>
        <p>Bonjour ${formData.firstName},</p>
        <p>Nous avons bien reçu votre message et vous répondrons rapidement.</p>
        <p>Cordialement,<br>Central Test Agency</p>
      `
    });

    console.log('✅ Gmail emails sent successfully');
    return true;
  } catch (error) {
    console.log('❌ Gmail failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}