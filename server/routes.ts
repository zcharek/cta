import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema } from "@shared/schema";
import { sendContactEmail } from "./emailService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);

      // Store contact form submission in database
      const contactSubmission = await storage.createContactSubmission(data);

      // Send email notification to z.charek@gmail.com
      const emailSent = await sendContactEmail(data);

      if (!emailSent) {
        console.warn("Contact form stored but email notification failed");
      }

      // Return success response
      res.status(200).json({
        success: true,
        message:
          "Merci pour votre message ! Nous vous répondrons très bientôt.",
        id: contactSubmission.id,
        emailSent: emailSent,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: error.errors,
        });
      } else {
        console.error("Error processing contact form:", error);
        res.status(500).json({
          success: false,
          message:
            "Une erreur s'est produite lors du traitement de votre demande.",
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
