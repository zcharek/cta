import { m } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E293B] text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-2xl font-poppins font-semibold mb-6">
              Central<span className="text-secondary">TestAgency</span>
            </div>
            <p className="text-gray-400 mb-6">
              Elevating digital experiences through expert testing and quality
              assurance solutions.
            </p>
            <div className="flex space-x-4">
              <m.a
                href="https://www.linkedin.com/company/central-test-agengy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -3 }}
              >
                <i className="fab fa-linkedin-in"></i>
              </m.a>
            </div>
          </m.div>

          {/* ... le reste du code reste inchangé ... */}
          {/* Services, Company, Resources, Footer bottom section */}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Central Test Agency. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
