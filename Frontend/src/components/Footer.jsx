import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import { AvailableServiceTypes } from '../constants/services'; // <-- IMPORT SERVICES

const footerLinks = [
  {
    title: 'Services',
    // UPDATED: Dynamically create service links
    links: AvailableServiceTypes.map(service => ({
      name: service,
      to: `/find?service=${encodeURIComponent(service)}`,
    })),
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', to: '/about' },
      { name: 'Blog', to: '/blog' },
      { name: 'Careers', to: '/careers' },
    ],
  },
  {
    title: 'For Professionals',
    links: [
      { name: 'Join as a Professional', to: '/worker-signup' },
      { name: 'Worker Login', to: '/worker-login' },
      { name: 'Partner Benefits', to: '/partner-benefits' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', to: '/privacy-policy' },
      { name: 'Terms of Service', to: '/terms-of-service' },
    ],
  },
];


const Footer = () => {
  return (
    <footer className="bg-[var(--color-bg-component)] border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          
          {footerLinks.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {column.title}
              </h3>
              {column.links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`text-base text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors ${
                    link.disabled ? 'opacity-50 cursor-not-allowed hover:text-[var(--color-text)]' : ''
                  }`}
                  // Prevent navigation for disabled links
                  onClick={(e) => {
                    if (link.disabled) e.preventDefault();
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}

        </div>
        <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-8 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 text-[var(--color-primary)]" />
            <p className="text-base text-[var(--color-text-muted)]">© 2025 HelpHive. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;