import React, { useRef, useEffect } from 'react';
import {
  GraduationCap, Award, BookOpen, Users, Phone,
  Home, Thermometer, FlaskConical, Mail, MapPin, Link, User, Monitor,
} from 'lucide-react';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getRef = (el: HTMLDivElement | null): React.RefObject<HTMLDivElement> | null => {
  return el ? { current: el } : null;
};

export function About() {
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const valuesRefs = useRef<HTMLDivElement[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const handleMouseMove = (e: MouseEvent, ref: React.RefObject<HTMLDivElement> | null) => {
    if (!ref || !ref.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      const rotateX = clamp(deltaY * 5, -5, 5).toFixed(2);
      const rotateY = clamp(-deltaX * 5, -5, 5).toFixed(2);
      ref.current.style.transform = `perspective(800px) rotateX(<span class="math-inline">\{rotateX\}deg\) rotateY\(</span>{rotateY}deg)`;
      ref.current.style.boxShadow = `0px ${Math.abs(deltaY * 2)}px ${Math.abs(deltaX * 2) + 3}px rgba(0, 0, 0, 0.1)`;
    });
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement> | null) => {
    if (!ref || !ref.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      ref.current.style.boxShadow = 'none';
    });
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="py-16 bg-gray-50 font-sans">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Misyon ve Vizyon */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-gray-800 tracking-tight">
            Misyon & Vizyon
          </h2>
          <p className="text-center text-gray-600 text-sm md:text-base mb-10">
            Okulumuzun temel amaç ve hedefleri
          </p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div
              ref={missionRef}
              className="parallax-card bg-white p-6 md:p-8 rounded-3xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
              onMouseMove={(e) => handleMouseMove(e, missionRef)}
              onMouseLeave={() => handleMouseLeave(missionRef)}
            >
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-3 md:mb-4">Misyonumuz</h3>
              <p className="text-gray-700 text-sm leading-relaxed text-base md:text-lg">Sürekli gelişim felsefemiz, hayatta başarılı olan öğrencilerimiz, nitelikli öğretmenlerimiz ve içimizdeki takım ruhu ile alanımızda en çok tercih edilen ve mensubu olmaktan gurur duyulan bir eğitim kurumu olmak.</p>
            </div>
            <div
              ref={visionRef}
              className="parallax-card bg-white p-6 md:p-8 rounded-3xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
              onMouseMove={(e) => handleMouseMove(e, visionRef)}
              onMouseLeave={() => handleMouseLeave(visionRef)}
            >
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-3 md:mb-4">Vizyonumuz</h3>
              <p className="text-gray-700 text-sm leading-relaxed text-base md:text-lg">Gençleri, toplumun her kesimini kucaklayacak, toplumsal duyarlılığı ve sorumluluk bilinci olan, alçak gönüllü, özgür düşünen, üretken ve bilgili, ülkesini seven bireyler olarak hayata hazırlamaktır.</p>
            </div>
          </div>
        </section>

        {/* Değerler */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-gray-800 tracking-tight">
            Değerlerimiz
          </h2>
           <p className="text-center text-gray-600 text-sm md:text-base mb-10">
            Okulumuzun temel değerleri ve prensipleri
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: "Akademik Mükemmellik", desc: "En yüksek eğitim standartlarını hedefleriz." },
              { icon: Award, title: "Etik Değerler", desc: "Dürüstlük, saygı ve sorumluluk ilkelerine bağlıyız." },
              { icon: BookOpen, title: "Yaşam Boyu Öğrenme", desc: "Sürekli gelişim ve öğrenmeyi teşvik ederiz." },
              { icon: Users, title: "İşbirliği ve Katılımcılık", desc: "Takım çalışmasına ve katılımcı yönetime inanırız." },
            ].map((value, i) => (
              <div
                key={i}
                ref={(el) => (valuesRefs.current[i] = el!)}
                className="parallax-card text-center p-5 md:p-6 bg-white rounded-3xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
                onMouseMove={(e) => handleMouseMove(e, getRef(valuesRefs.current[i]))}
                onMouseLeave={() => handleMouseLeave(getRef(valuesRefs.current[i]))}
              >
                <value.icon className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3 md:mb-4 text-blue-500" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Okul Bilgileri */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-gray-800 tracking-tight">
            Okul Bilgileri
          </h2>
          <p className="text-center text-gray-600 text-sm md:text-base mb-10">
            İletişim, genel bilgiler, altyapı ve başarılarımız
          </p>
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">

              {/* İletişim Bilgileri */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4 md:mb-6 flex items-center">
                  <Phone className="h-6 w-6 md:h-7 md:w-7 mr-2 md:mr-3 text-blue-500" />
                  İletişim
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700 font-medium w-20 text-xs md:text-sm">Telefon:</span>
                    <span className="text-gray-600 text-xs md:text-sm">03644522202</span>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2 mt-0.5" />
                    <span className="text-gray-700 font-medium w-20 text-xs md:text-sm">E-posta:</span>
                    <a href="mailto:968632@meb.k12.tr" className="text-blue-500 hover:underline text-xs md:text-sm text-gray-600">
                      968632@meb.k12.tr
                    </a>
                  </div>
                  <div className="flex items-start">
                    <Link className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2 mt-0.5" />
                    <span className="text-gray-700 font-medium w-20 text-xs md:text-sm">Web:</span>
                    <a href="https://bogazkalecpal.meb.k12.tr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-xs md:text-sm text-gray-600"
                    >
                      bogazkalecpal.meb.k12.tr
                    </a>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2 mt-0.5" />
                    <span className="text-gray-700 font-medium w-20 text-xs md:text-sm">Adres:</span>
                    <span className="text-gray-600 text-xs md:text-sm">HATTUSAS MAHALLESI ŞUŞA CAD. NO: 2 BOĞAZKALE/ÇORUM</span>
                  </div>
                </div>
              </div>

              {/* Genel Bilgiler */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4 md:mb-6 flex items-center">
                  <Users className="h-6 w-6 md:h-7 md:w-7 mr-2 md:mr-3 text-blue-500" />
                  Genel Bilgiler
                </h3>
                <div className="space-y-2 md:space-y-3">
                <div className="flex items-center">
                    <User className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Öğretmen Sayısı:</span>
                    <span className="text-gray-600 text-xs md:text-sm">21</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Öğrenci Sayısı:</span>
                    <span className="text-gray-600 text-xs md:text-sm">116</span>
                  </div>
                  <div className="flex items-center">
                    <Monitor className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Derslik Sayısı:</span>
                    <span className="text-gray-600 text-xs md:text-sm">10</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className='h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500' />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Isınma:</span>
                    <span className="text-gray-600 text-xs md:text-sm">Kalorifer</span>
                  </div>
                  <div className="flex items-center">
                    <Link className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Bağlantı:</span>
                    <span className="text-gray-600 text-xs md:text-sm">Fatih Projesi Fiber İnternet</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Yabancı Dil:</span>
                    <span className='text-gray-600 text-xs md:text-sm'>İngilizce</span>
                  </div>
                </div>
              </div>

              {/* Altyapı */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4 md:mb-6 flex items-center">
                  <Home className="h-6 w-6 md:h-7 md:w-7 mr-2 md:mr-3 text-blue-500" />
                  Altyapı
                </h3>
                <div className="space-y-2 md:space-y-3">
                <div className="flex items-center">
                    <Home className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-52 text-xs md:text-sm">Çok Amaçlı Salon:</span>
                    <span className="text-gray-600 text-xs md:text-sm">1</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-52 text-xs md:text-sm">Spor Salonu:</span>
                    <span className="text-gray-600 text-xs md:text-sm">2</span>
                  </div>
                  <div className="flex items-center">
                    <FlaskConical className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-52 text-xs md:text-sm">Fen Laboratuvarı:</span>
                    <span className="text-gray-600 text-xs md:text-sm">1</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-52 text-xs md:text-sm">Kütüphane:</span>
                    <span className='text-gray-600 text-xs md:text-sm'>1</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-52 text-xs md:text-sm">Kütüphane Kitap Sayısı:</span>
                    <span className="text-gray-600 text-xs md:text-sm">3002</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium w-52 text-xs md:text-sm">Saatler:</span>
                    <span className="text-gray-600 text-xs md:text-sm">08:20 - 15:30</span>
                  </div>
                </div>
              </div>

              {/* Diğer/Başarılar */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4 md:mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 md:h-7 md:w-7 mr-2 md:mr-3 text-blue-500" />
                  Diğer/Başarılar
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start">
                    <Award className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Başarılar:</span>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Okulumuz, 2015 YGS'de %100 başarı göstermiş ve LYS'de öğrencilerimizin %70'i
                      üniversiteye yerleşmiştir.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">İl/İlçe Merkezine Uzaklık:</span>
                    <p className='text-gray-600 text-xs md:text-sm'>İl Merkezine 85 KM</p>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 font-medium w-40 text-xs md:text-sm">Kontenjan Bilgileri:</span>
                    <p className='text-gray-600 text-xs md:text-sm'>34</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;