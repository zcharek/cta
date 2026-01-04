import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  service: z.string().min(1, "Veuillez sélectionner un service"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const ContactModal = ({ isOpen, onClose, preselectedService }: ContactModalProps) => {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  // Mettre à jour le service présélectionné quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && preselectedService) {
      form.setValue("service", preselectedService);
    }
  }, [isOpen, preselectedService, form]);

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("company", data.company);
      formData.append("service", data.service);
      formData.append("message", data.message);

      console.log("Envoi du formulaire à Formspree...", data);
      
      const response = await fetch("https://formspree.io/f/manjygqn", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      
      console.log("Réponse Formspree:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur Formspree:", errorText);
        throw new Error(`Erreur lors de l'envoi: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Succès Formspree:", result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "✅ Message envoyé avec succès !",
        description: "Merci pour votre confiance. Notre équipe vous répondra sous 24h ouvrées.",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erreur d'envoi",
        description: "Désolé, une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Formulaire soumis avec les données:", data);
    contactMutation.mutate(data);
  };

  const services = [
    { value: "Test fonctionnel", label: "Test fonctionnel" },
    { value: "Test non-fonctionnel", label: "Test non-fonctionnel" },
    { value: "Test statique", label: "Test statique" },
    { value: "Test dynamique", label: "Test dynamique" },
    { value: "Autre", label: "Autre" },
  ];

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl relative flex flex-col">
        {/* En-tête de la modale */}
        <div className="rounded-t-3xl px-8 pt-8 pb-4 border-b border-gray-100 bg-white text-center relative">
          <button
            onClick={handleClose}
            aria-label="Fermer la modale"
            className="absolute top-4 right-4 text-gray-400 hover:text-brand-blue-600 text-3xl font-light transition-all duration-200 hover:scale-110 z-50 cursor-pointer bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200"
          >
            ×
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Nous contacter</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">Besoin d'un conseil, d'un devis ou d'un accompagnement ? Notre équipe vous répond sous 24h.</p>
        </div>
        {/* Contenu du formulaire */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Prénom <span className="text-brand-blue-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  {...form.register("firstName")}
                />
                {form.formState.errors.firstName && (
                  <p className="text-brand-blue-600 text-xs sm:text-sm mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Nom <span className="text-brand-blue-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  {...form.register("lastName")}
                />
                {form.formState.errors.lastName && (
                  <p className="text-brand-blue-600 text-xs sm:text-sm mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Adresse Email <span className="text-brand-blue-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-brand-blue-600 text-xs sm:text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Entreprise / Organisation <span className="text-brand-blue-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nom de l'entreprise"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  {...form.register("company")}
                />
                {form.formState.errors.company && (
                  <p className="text-brand-blue-600 text-xs sm:text-sm mt-1">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Service souhaité <span className="text-brand-blue-600">*</span>
              </label>
              <select
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base bg-white"
                {...form.register("service")}
              >
                <option value="">Sélectionnez un service</option>
                {services.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {form.formState.errors.service && (
                <p className="text-brand-blue-600 text-xs sm:text-sm mt-1">
                  {form.formState.errors.service.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Message <span className="text-brand-blue-600">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Décrivez votre besoin, votre projet ou posez-nous votre question..."
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-none"
                {...form.register("message")}
              />
              {form.formState.errors.message && (
                <p className="text-brand-blue-600 text-xs sm:text-sm mt-1">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-brand-blue-900 hover:bg-brand-blue-800 text-white font-bold rounded-xl text-base sm:text-lg shadow-lg transition-all duration-200"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 