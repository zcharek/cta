import React, { useState } from "react";
import { m } from "framer-motion";

const CTASection = () => {
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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis.";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis.";
    if (!formData.email.trim()) newErrors.email = "Email requis.";
    if (!formData.company.trim()) newErrors.company = "Société requise.";
    if (!formData.service.trim())
      newErrors.service = "Veuillez choisir un service.";
    if (!formData.message.trim()) newErrors.message = "Message requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/manjygqn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          service: "",
          message: "",
        });
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

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
                Prêt à améliorer la qualité de vos logiciels ? Contactez-nous
                pour une consultation gratuite.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-white mb-2"
                        htmlFor="firstName"
                      >
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {errors.firstName && (
                        <p className="text-red-300 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-white mb-2"
                        htmlFor="lastName"
                      >
                        Nom
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {errors.lastName && (
                        <p className="text-red-300 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="email"
                    >
                      Adresse Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    {errors.email && (
                      <p className="text-red-300 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="company"
                    >
                      Société
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      placeholder="Nom de votre société"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    {errors.company && (
                      <p className="text-red-300 text-sm mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="service"
                    >
                      Service souhaité
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <option value="" className="text-gray-800">
                        Sélectionner un service
                      </option>
                      {services.map((service) => (
                        <option
                          key={service.value}
                          value={service.value}
                          className="text-gray-800"
                        >
                          {service.label}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-300 text-sm mt-1">
                        {errors.service}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre projet et vos besoins en détail..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    {errors.message && (
                      <p className="text-red-300 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-white text-primary py-3 px-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {status === "sending" ? "Envoi..." : "Envoyer le message"}
                  </button>
                </form>

                {status === "success" && (
                  <p className="mt-4 text-green-400 font-semibold text-center">
                    Merci ! Votre message a bien été envoyé.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-4 text-red-400 font-semibold text-center">
                    Oups, une erreur est survenue. Veuillez réessayer plus tard.
                  </p>
                )}
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default CTASection;
