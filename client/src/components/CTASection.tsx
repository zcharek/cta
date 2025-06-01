import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { m } from "framer-motion";
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

const CTASection = () => {
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

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container">
        <m.div
          className="gradient-bg rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <i className="fas fa-code text-white text-9xl absolute -top-5 -right-5"></i>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Nous contacter
              </h2>
              <p className="text-lg text-secondary-light max-w-2xl mx-auto">
                Prêt à améliorer la qualité de vos logiciels ? Contactez-nous pour
                une consultation gratuite.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        placeholder="Votre prénom"
                        className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 bg-white/20 text-white placeholder-white/70"
                        {...form.register("firstName")}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-red-300 text-sm mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 bg-white/20 text-white placeholder-white/70"
                        {...form.register("lastName")}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-red-300 text-sm mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 bg-white/20 text-white placeholder-white/70"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-300 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Société
                    </label>
                    <input
                      type="text"
                      placeholder="Nom de votre société"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 bg-white/20 text-white placeholder-white/70"
                      {...form.register("company")}
                    />
                    {form.formState.errors.company && (
                      <p className="text-red-300 text-sm mt-1">
                        {form.formState.errors.company.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Service souhaité
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 bg-white/20 text-white"
                      {...form.register("service")}
                    >
                      <option value="" className="text-gray-800">Sélectionner un service</option>
                      {services.map((service) => (
                        <option key={service.value} value={service.value} className="text-gray-800">
                          {service.label}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.service && (
                      <p className="text-red-300 text-sm mt-1">
                        {form.formState.errors.service.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Décrivez votre projet et vos besoins en détail..."
                      rows={5}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 resize-none bg-white/20 text-white placeholder-white/70"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-red-300 text-sm mt-1">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-primary py-3 px-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        </m.div>
      </div>
    </section>
  );
};

export default CTASection;