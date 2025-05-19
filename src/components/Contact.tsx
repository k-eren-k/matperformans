import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="py-12">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-4xl font-light text-center mb-16">İletişim</h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-medium mb-8">İletişim Bilgileri</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-gray-900 mt-1" />
                  <div>
                    <h4 className="font-medium mb-2">Adres</h4>
                    <p className="text-gray-600">
                      Yeni Mahalle, Okul Caddesi No:123<br />
                      34000 İstanbul/Türkiye
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-gray-900 mt-1" />
                  <div>
                    <h4 className="font-medium mb-2">Telefon</h4>
                    <p className="text-gray-600">+90 (212) 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-gray-900 mt-1" />
                  <div>
                    <h4 className="font-medium mb-2">E-posta</h4>
                    <p className="text-gray-600">info@mkpal.edu.tr</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-gray-900 mt-1" />
                  <div>
                    <h4 className="font-medium mb-2">Çalışma Saatleri</h4>
                    <p className="text-gray-600">
                      Pazartesi - Cuma: 08:30 - 17:00<br />
                      Cumartesi - Pazar: Kapalı
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-medium mb-8">Bize Ulaşın</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Adınız ve soyadınız"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="E-posta adresiniz"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Mesajınızın konusu"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Mesajınız..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-medium mb-8">Konum</h3>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1527.6273526203354!2d34.60905089668873!3d40.025092372677356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40805f3695964d1d%3A0xd1e079396d3b8c9f!2sBo%C4%9Fazkale%20Lisesi!5e0!3m2!1str!2str!4v1739291964584!5m2!1str!2str"
height="100%"
              width="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}