import { Link } from 'react-router-dom';
import {
  HiEnvelope,
  HiPhone,
  HiMapPin,
} from 'react-icons/hi2';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'Become a Provider', to: '/become-provider' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
    ],
    support: [
      { label: 'Help Center', to: '#' },
      { label: 'Safety', to: '#' },
      { label: 'Cancellation Policy', to: '#' },
      { label: 'Contact Us', to: '#' },
    ],
    explore: [
      { label: 'Browse Vehicles', to: '/vehicles' },
      { label: 'Cars', to: '/vehicles?type=car' },
      { label: 'Bikes', to: '/vehicles?type=bike' },
      { label: 'Scooters', to: '/vehicles?type=scooter' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-surface-900 text-surface-300">
      {/* Main footer */}
      <div className="container-app pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
              <img src={logo} alt="RideEasy" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-body-sm text-surface-400 max-w-sm mb-6 leading-relaxed">
              Your trusted platform for vehicle rentals. Find the perfect ride for every journey — cars, bikes, and scooters available across India.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-body-sm text-surface-400">
                <HiMapPin className="w-4 h-4 text-surface-500 flex-shrink-0" />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center gap-3 text-body-sm text-surface-400">
                <HiEnvelope className="w-4 h-4 text-surface-500 flex-shrink-0" />
                <a href="mailto:support@rideeasy.in" className="hover:text-white transition-colors">
                  support@rideeasy.in
                </a>
              </div>
              <div className="flex items-center gap-3 text-body-sm text-surface-400">
                <HiPhone className="w-4 h-4 text-surface-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div>
            <h4 className="text-body-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-800">
        <div className="container-app py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-surface-500">
            © {currentYear} RideEasy. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
