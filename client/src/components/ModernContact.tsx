import { motion as m } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '@shared/schema';

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  message: string;
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export const ModernContact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      service: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message envoyé !',
        description: 'Nous vous recontacterons dans les plus brefs délais.',
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du message.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contactez{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nous
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Prêt à révolutionner vos processus de test ? Discutons de votre projet ensemble.
          </p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="webflow-card p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Démarrer un projet
            </h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prénom
                  </label>
                  <input
                    {...form.register('firstName')}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Votre prénom"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom
                  </label>
                  <input
                    {...form.register('lastName')}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Votre nom"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  {...form.register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="votre@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Entreprise
                </label>
                <input
                  {...form.register('company')}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Nom de votre entreprise"
                />
                {form.formState.errors.company && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service requis
                </label>
                <select
                  {...form.register('service')}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="">Sélectionnez un service</option>
                  <option value="test-automation">Tests automatisés</option>
                  <option value="mobile-testing">Tests mobiles</option>
                  <option value="web-testing">Tests web</option>
                  <option value="performance-testing">Tests de performance</option>
                  <option value="security-testing">Tests de sécurité</option>
                  <option value="ux-testing">Tests UX</option>
                </select>
                {form.formState.errors.service && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.service.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  {...form.register('message')}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="Décrivez votre projet et vos besoins..."
                />
                {form.formState.errors.message && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <m.button
                type="submit"
                disabled={mutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold rounded-lg transition-all duration-300"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </m.button>
            </form>
          </m.div>

          {/* Contact Info */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  value: 'z.charek@gmail.com',
                  description: 'Réponse sous 24h',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Phone,
                  title: 'Téléphone',
                  value: '+33 1 23 45 67 89',
                  description: 'Lun-Ven 9h-18h',
                  gradient: 'from-green-500 to-teal-500'
                },
                {
                  icon: MapPin,
                  title: 'Localisation',
                  value: 'France & International',
                  description: 'Service mondial',
                  gradient: 'from-purple-500 to-pink-500'
                }
              ].map((contact, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="webflow-card p-6 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${contact.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <contact.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {contact.title}
                      </h4>
                      <p className="text-gray-300 font-medium mb-1">
                        {contact.value}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>

            {/* CTA Card */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="webflow-card p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20"
            >
              <h4 className="text-2xl font-bold text-white mb-4">
                Consultation gratuite
              </h4>
              <p className="text-gray-300 mb-6">
                Bénéficiez d'une analyse gratuite de vos besoins en testing avec nos experts.
              </p>
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all duration-300"
              >
                Planifier un appel
                <ArrowRight className="w-5 h-5" />
              </m.button>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
};