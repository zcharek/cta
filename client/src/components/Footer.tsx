import { m } from 'framer-motion';

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
              Central<span className="text-secondary">Test</span>
            </div>
            <p className="text-gray-400 mb-6">
              Elevating digital experiences through expert testing and quality assurance solutions.
            </p>
            <div className="flex space-x-4">
              <m.a 
                href="https://linkedin.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -3 }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('LinkedIn profile will be available after deployment.');
                }}
              >
                <i className="fab fa-linkedin-in"></i>
              </m.a>
              <m.a 
                href="https://twitter.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -3 }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Twitter profile will be available after deployment.');
                }}
              >
                <i className="fab fa-twitter"></i>
              </m.a>
              <m.a 
                href="https://facebook.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -3 }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Facebook profile will be available after deployment.');
                }}
              >
                <i className="fab fa-facebook-f"></i>
              </m.a>
              <m.a 
                href="https://instagram.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -3 }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Instagram profile will be available after deployment.');
                }}
              >
                <i className="fab fa-instagram"></i>
              </m.a>
            </div>
          </m.div>
          
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200">Functional Testing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200">UX Testing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200">Automated Testing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200">Performance Testing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200">Security Testing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200">API Testing</a></li>
            </ul>
          </m.div>
          
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors duration-200">Case Studies</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors duration-200">Testimonials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </m.div>
          
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Webinars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Whitepapers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Testing Tools</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </m.div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Central Test Agency. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
