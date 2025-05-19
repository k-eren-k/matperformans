import React, { useState, useRef, useEffect } from 'react';
import { School, Users, Building2, GraduationCap, Trophy, HelpCircle, CheckCircle, Plus, Minus } from 'lucide-react';

interface Stat {
  id: string;
  number: string;
  label: string;
  icon: React.ComponentType;
}

interface Feature {
  id: string;
  icon: React.ComponentType;
  title: string;
  desc: string;
  points: string[];
}

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export function PublicHome() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);


  const stats: Stat[] = [
    { id: "students", number: "500+", label: "Öğrenci", icon: Users },
    { id: "teachers", number: "45+", label: "Öğretmen", icon: GraduationCap },
    { id: "classrooms", number: "25+", label: "Sınıf", icon: Building2 },
    { id: "success", number: "98%", label: "Başarı", icon: Trophy },
  ];

  const features: Feature[] = [
    {
      id: "modern",
      icon: School,
      title: "Modern Müfredat",
      desc: "Sürekli güncellenen, çağdaş eğitim.",
      points: [
        "Proje tabanlı öğrenme",
        "STEM eğitimi",
        "Sanat ve spor entegrasyonu",
        "Yabancı dil programları"
      ]
    },
    {
      id: "expert",
      icon: Users,
      title: "Uzman Kadro",
      desc: "Deneyimli ve yenilikçi öğretmenler.",
      points: [
        "Sürekli gelişim",
        "Öğrenci odaklılık",
        "Bireysel farklılıklar",
        "Mentorluk"
      ]
    },
    {
      id: "success-oriented",
      icon: Trophy,
      title: "Başarı Odaklı",
      desc: "Akademik ve sosyal başarı hedefi.",
      points: [
        "Üniversite rehberliği",
        "Kariyer danışmanlığı",
        "Bireysel gelişim",
        "Yarışmalara katılım"
      ]
    },
  ];

  const faqItems: FaqItem[] = [
    { id: "q1", q: "Kayıt şartları nelerdir?", a: "Okulumuzda kayıt için gerekli belgeler: Kimlik fotokopisi, ikametgah belgesi, ortaokul diploması, 4 adet fotoğraf ve sağlık raporu gerekmektedir. Kayıtlar her yıl Temmuz-Ağustos aylarında yapılmaktadır.  Detaylı bilgi ve kontenjan durumu için okulumuzla iletişime geçebilirsiniz." },
    { id: "q2", q: "Okulun eğitim saatleri nedir?", a: "Okulumuz 08:30 - 15:30 saatleri arasında tam gün eğitim vermektedir. Öğle arası 12:00 - 13:00 arasındadır.  Seçmeli dersler, kulüp çalışmaları ve etütler ile 16:30'a kadar eğitim devam edebilmektedir.  Öğrencilerimizin bireysel ihtiyaçlarına göre esnek programlar sunulmaktadır." },
    { id: "q3", q: "Hangi bölümler bulunmaktadır?", a: "Okulumuzda Bilişim Teknolojileri, Elektrik-Elektronik ve Muhasebe bölümleri bulunmaktadır.  Her bölüm, son teknoloji ile donatılmış modern laboratuvarlar ve atölyelerde uygulamalı eğitim imkanı sunmaktadır.  Bölümlerimiz, sektörün ihtiyaç duyduğu nitelikli iş gücünü yetiştirmeyi amaçlamaktadır." },
    { id: "q4", q: "Okulunuzda hangi sosyal etkinlikler düzenleniyor?", a: "Okulumuzda öğrencilerimizin sosyal, kültürel ve sportif gelişimlerini desteklemek amacıyla çeşitli kulüpler, etkinlikler ve yarışmalar düzenlenmektedir. Bunlar arasında tiyatro, müzik, resim, satranç, kodlama, robotik, futbol, basketbol, voleybol gibi birçok farklı alanda faaliyetler bulunmaktadır." },
    { id: "q5", q: "Okulunuzun ulaşım imkanları nasıl?", a: "Okulumuz şehir merkezine yakın bir konumda bulunmaktadır ve toplu taşıma araçlarıyla kolayca ulaşılabilir. Ayrıca, öğrencilerimiz için servis imkanı da sunmaktayız. Servis güzergahları ve ücretleri hakkında detaylı bilgi almak için okul yönetimiyle iletişime geçebilirsiniz." },
    { id: "q6", q: "Okulunuzda yemekhane hizmeti var mı?", a: "Evet, okulumuzda modern ve hijyenik bir yemekhane bulunmaktadır. Öğrencilerimize öğle yemeği ve isteğe bağlı olarak ara öğünler sunulmaktadır. Yemeklerimiz, diyetisyen kontrolünde hazırlanmakta ve sağlıklı beslenme ilkelerine uygun olarak çeşitlendirilmektedir." }
  ];

  const statRefs = stats.map(() => useRef<HTMLDivElement>(null));
  const faqRefs = faqItems.map(() => useRef<HTMLDivElement>(null));


  const handleMouseMove = (e: MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / (rect.width / 3);
      const deltaY = (y - centerY) / (rect.height / 3);

      const rotateX = (deltaY * 5).toFixed(2);
      const rotateY = (-deltaX * 5).toFixed(2);

      ref.current.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
      ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      ref.current.style.boxShadow = `0px ${Math.abs(deltaY * 10)}px ${Math.abs(deltaX * 10) + 12}px rgba(0, 0, 0, 0.18)`;
      ref.current.style.zIndex = "10";
    }
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.style.transition = 'transform 0.3s ease-in, box-shadow 0.3s ease-in, z-index 0.3s ease-in';
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      ref.current.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';
      ref.current.style.zIndex = "1";
    }
  };

  const handleFeatureHover = (featureId: string) => {
    setHoveredFeature(featureId);
  };

  const handleFeatureLeave = () => {
    setHoveredFeature(null);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

    useEffect(() => {
        faqRefs.forEach((ref, index) => {
            if (ref.current) {
                if (openFaq === index) {
                    ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
                } else {
                    ref.current.style.maxHeight = '0px';
                }
            }
        });
    }, [openFaq]);

  // Hero image load handler
  const handleHeroImageLoad = () => {
    setHeroLoaded(true);
  };


  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          alt="School Building"
          onLoad={handleHeroImageLoad}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">Mustafa Karasakal</h1>
            <h2 className="text-lg md:text-xl lg:text-2xl font-light mb-6 text-white/80">Çok Programlı Anadolu Lisesi</h2>
            <p className="text-sm md:text-base lg:text-lg font-light max-w-2xl mx-auto text-white/90">
              Geleceğin liderlerini yetiştiren, yenilikçi ve kapsayıcı eğitim anlayışıyla öncü bir kurum.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 -mt-20 md:-mt-24 relative z-10 mb-20 md:mb-28">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              ref={statRefs[index]}
              className="bg-white rounded-3xl p-4 md:p-6 shadow-lg text-center cursor-pointer transition-all duration-300 hover:shadow-xl"
              onMouseMove={(e) => handleMouseMove(e, statRefs[index])}
              onMouseLeave={() => handleMouseLeave(statRefs[index])}
            >
              <stat.icon className="h-7 w-7 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 text-gray-900" />
              <div className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{stat.number}</div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section className="py-20 md:py-28 border-t">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Neden Biz?</h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Öğrencilerimize en iyi eğitimi sunmak için sürekli gelişiyor ve yenileniyoruz.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="text-center group cursor-pointer"
                onMouseEnter={() => handleFeatureHover(feature.id)}
                onMouseLeave={handleFeatureLeave}
              >
                <div className="mb-4 md:mb-6 relative">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center
                          ${hoveredFeature === feature.id ? 'bg-gray-900' : ''}
                          transition-colors duration-300`}
                  >
                    <feature.icon
                      className={`h-7 w-7 md:h-8 md:w-8
                              ${hoveredFeature === feature.id ? 'text-white' : 'text-gray-900'}
                              transition-colors duration-300`}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-base md:text-lg mb-4">{feature.desc}</p>
                <ul className="list-none text-left pl-4">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="mb-2 flex items-center">
                      <CheckCircle
                        className={`h-4 w-4 mr-2 transition-colors duration-300
                                  ${hoveredFeature === feature.id ? 'text-green-500' : 'text-gray-400'}`}

                      />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 border-t">
          <div className="text-center mb-8 md:mb-12">
            {/* Removed HelpCircle icon */}
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Sıkça Sorulan Sorular</h2> {/* Increased font size and made it bold */}
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mt-2">
              Merak ettiğiniz soruların cevaplarını aşağıda bulabilirsiniz.
            </p>
          </div>
          <div>
            {faqItems.map((faq, i) => (
              <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md mb-2">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="font-medium text-base md:text-lg text-gray-900">{faq.q}</h3>
                  {openFaq === i ? (
                    <Minus className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                  ) : (
                    <Plus className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                  )}
                </button>
                <div
                    ref={faqRefs[i]}
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{ maxHeight: openFaq === i ? `${faqRefs[i]?.current?.scrollHeight}px` : '0px' }}

                >
                    <p className="p-4 md:p-5 pt-0 text-gray-600 text-sm md:text-base">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default PublicHome;