import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const msg = {
      to: 'z.charek@gmail.com',
      from: 'noreply@centraltestagency.com', // This should be a verified sender in SendGrid
      subject: `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`,
      text: `
New contact form submission received:

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Company: ${formData.company}
Service Interest: ${formData.service}

Message:
${formData.message}

---
This message was sent from the Central Test Agency website contact form.
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">New Contact Form Submission</h2>
  
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1e293b; margin-top: 0;">Contact Information</h3>
    <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
    <p><strong>Company:</strong> ${formData.company}</p>
    <p><strong>Service Interest:</strong> ${formData.service}</p>
  </div>
  
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
    <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
    <p style="white-space: pre-wrap;">${formData.message}</p>
  </div>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
  <p style="color: #64748b; font-size: 14px;">
    This message was sent from the Central Test Agency website contact form.
  </p>
</div>
      `,
    };

    await sgMail.send(msg);
    console.log('Contact form email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
}