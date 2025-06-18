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

      const response = await fetch("https://formspree.io/f/manjygqn", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Formulaire soumis avec les données:", data);
    contactMutation.mutate(data);
  };

  const services = [
    { value: "Tests Fonctionnels", label: "Tests Fonctionnels" },
    { value: "Tests End-to-End", label: "Tests End-to-End" },
    { value: "Tests Full-Cycle", label: "Tests Full-Cycle" },
    { value: "Tests de Régression", label: "Tests de Régression" },
    { value: "Tests d'Intégration", label: "Tests d'Intégration" },
    { value: "Tests d'Accessibilité", label: "Tests d'Accessibilité" },
    { value: "Tests Automatisés", label: "Tests Automatisés" },
    { value: "Autres services", label: "Autres services" },
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
      <div className="bg-white w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl relative">
        {/* En-tête de la modale */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-700 to-pink-800 text-white p-6 sm:p-8 rounded-t-2xl sm:rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <button
            onClick={handleClose}
            aria-label="Fermer la modale"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-200 text-3xl sm:text-4xl font-light transition-all duration-200 hover:scale-110 z-50 cursor-pointer bg-black bg-opacity-20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-opacity-30"
          >
            ×
          </button>
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white drop-shadow-lg">
              Nous contacter
            </h2>
            <p className="text-purple-100 text-base sm:text-lg">
              Prêt à améliorer la qualité de vos logiciels ? Contactez-nous pour une consultation gratuite.
            </p>
          </div>
        </div>

        {/* Contenu du formulaire */}
        <div className="p-6 sm:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  {...form.register("firstName")}
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  {...form.register("lastName")}
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Société
              </label>
              <input
                type="text"
                placeholder="Nom de votre société"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                {...form.register("company")}
              />
              {form.formState.errors.company && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service souhaité
              </label>
              <select
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                {...form.register("service")}
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
              {form.formState.errors.service && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {form.formState.errors.service.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                placeholder="Décrivez votre projet et vos besoins en détail..."
                rows={4}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                {...form.register("message")}
              />
              {form.formState.errors.message && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 