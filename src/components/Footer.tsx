import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  School, 
  Facebook, 
  Twitter, 
  Instagram, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight,
  Send
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('error');
      return;
    }

    try {
      // Simulated newsletter subscription 
      // Replace with actual API call in production
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error) {
      setSubscriptionStatus('error');
    }
  };

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://facebook.com/mkpal", 
      label: "Facebook" 
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/mkpal", 
      label: "Twitter" 
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/mkpal", 
      label: "Instagram" 
    }
  ];

  const quickLinks = [
    { to: "/", label: "Ana Sayfa" },
    { to: "/about", label: "Hakkımızda" },
    { to: "/programs", label: "Eğitim Programları" },
    { to: "/contact", label: "İletişim" },
    { to: "/login", label: "Giriş Yap" }
  ];

  return (
    <footer className="bg-white text-gray-700 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {/* School Info */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              aria-label="Ana Sayfa"
            >
              <School className="h-8 w-8 text-blue-500 transition-colors duration-300 group-hover:text-blue-600" />
              <span className="font-semibold text-xl tracking-wider text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                MKÇPAL
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Yenilikçi ve öğrenci merkezli eğitim anlayışımızla, geleceğin başarılı bireylerini yetiştiriyoruz.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a 
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 tracking-wide uppercase">
              Bağlantılar
            </h3>
            <ul className="space-y-4">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-base flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 tracking-wide uppercase">
              İletişim
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm leading-6">
                  Yeni Mahalle, Okul Caddesi No:123
                  <br />
                  34000 İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <a 
                  href="tel:+902121234567" 
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm"
                >
                  +90 (212) 123 45 67
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <a 
                  href="mailto:info@mkpal.edu.tr" 
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm"
                >
                  info@mkpal.edu.tr
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 tracking-wide uppercase">
              Bülten
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Okulumuzla ilgili en son haberleri ve duyuruları almak için e-posta bültenimize abone olun.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscriptionStatus('idle');
                }}
                placeholder="E-posta adresiniz"
                className="w-full px-4 py-2.5 rounded-full bg-gray-100 text-gray-700 
                  placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent 
                  transition-colors duration-300"
                aria-label="E-posta adresiniz"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-full 
                  bg-blue-500 hover:bg-blue-600 text-white 
                  transition-colors duration-300 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  flex items-center justify-center"
                aria-label="Abone Ol"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            {/* Subscription Status Feedback */}
            {subscriptionStatus === 'success' && (
              <p className="text-green-600 text-sm mt-2">
                Bültene başarıyla abone oldunuz!
              </p>
            )}
            {subscriptionStatus === 'error' && (
              <p className="text-red-600 text-sm mt-2">
                Abonelik sırasında bir hata oluştu. Lütfen tekrar deneyin.
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-2">
            &copy; {new Date().getFullYear()} M.K. Çok Programlı Anadolu Lisesi. Tüm hakları saklıdır.
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-blue-500 transition-colors">
              Gizlilik Politikası
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-blue-500 transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
