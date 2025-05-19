import React, { useState } from 'react';
import { Users, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  title?: 'Müdür' | 'Müdür Yardımcısı';
  gender: 'male' | 'female';
  // skills: string[];
}

const teachersData: Teacher[] = [
  { id: 1, name: 'İsmail BALLI', subject: 'Okul Yönetimi', title: '', gender: 'male' },
  { id: 2, name: 'Kemal Tezel', subject: 'Okul Yönetimi', title: '', gender: 'female' },
  { id: 3, name: 'Büşra ÖZALP', subject: 'Edebiyat', gender: 'female' },
  { id: 4, name: 'Meltem Çalman', subject: 'Edebiyat', gender: 'female' },
  { id: 5, name: 'Gözde Özyılmaz', subject: 'Edebiyat', gender: 'female' },
  { id: 6, name: 'Sultan DERİNCEK', subject: 'Biyoloji', gender: 'female' },
  { id: 7, name: 'Sıddık ŞENAY', subject: 'Fizik', gender: 'male' },
  { id: 8, name: 'Gül ARSLAN', subject: 'Matematik', gender: 'female' },
  { id: 9, name: 'Salih ÖZCAN', subject: 'Matematik', gender: 'male' },
  { id: 10, name: 'Eda ERTOSUN', subject: 'İngilizce', gender: 'female' },
  { id: 11, name: 'Kebire SARI', subject: 'İngilizce', gender: 'female' },
  { id: 12, name: 'Emine KAPAKLI', subject: 'Tarih', gender: 'female' },
  { id: 13, name: 'Mert Can KARACAN', subject: 'Tarih', gender: 'male' },
  { id: 14, name: 'Reyhan ERMİŞ', subject: 'Felsefe', gender: 'female' },
  { id: 15, name: 'Cevale ARSLAN', subject: 'İ.H.L Meslek Dersleri', gender: 'female' },
  { id: 16, name: 'İsmail BALKANLIOĞLU', subject: 'İ.H.L Meslek Dersleri', gender: 'male' },
  { id: 17, name: 'Güneş Doğuş AYKOL', subject: 'Beden E.', gender: 'male' },
  { id: 18, name: 'Gönül ÇAKICILAR', subject: 'Resim', gender: 'female' },
  { id: 19, name: 'Mustafa Bayrak', subject: 'Kimya', gender: 'male' }
];

export function Teachers() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const groupedTeachers = teachersData.reduce((groups, teacher) => {
    const subject = teacher.subject;
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(teacher);
    return groups;
  }, {} as { [key: string]: Teacher[] });

  const toggleSection = (subject: string) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [subject]: !prevOpenSections[subject],
    }));
  };

  const totalTeachers = teachersData.length;

  return (
    <div className="p-4 max-w-[1216px] mx-auto">
      {/* Bilgi Bölümü */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-gray-500" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Öğretmen Kadromuz
          </h1>
        </div>

        <p className="text-gray-600 mt-2">
          Alanında uzman <span className="font-semibold text-gray-800">{totalTeachers}</span> öğretmenimizle,
          öğrencilerimizin başarısı için çalışıyoruz.
        </p>
      </div>

      {/* Öğretmen Listesi - Modern Versiyon */}
      <div className="mb-6"> {/* Bölüm arasına boşluk */}
        <h2 className="text-3xl font-semibold text-gray-800 tracking-tight border-b pb-2 mb-4"> {/* Daha büyük, şık başlık */}
          
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg">
        {/* ... (Müdür, Müdür Yardımcısı ve Diğer Branşlar kısımları aynı) ... */}
         {/* Müdür ve Müdür Yardımcısı */}
         {groupedTeachers['Okul Yönetimi'] && (
          <div className="border-b last:border-none">
<h3 className="p-4 text-xl font-semibold bg-white-50 rounded-t-2xl border-b border-gray-200">Yetkililer</h3>            {groupedTeachers['Okul Yönetimi'].map((teacher) => (
              <div
                key={teacher.id}
                className={`p-4 flex items-center transition duration-200 cursor-pointer
                  ${teacher.gender === 'male' ? 'hover:bg-blue-50/50' : 'hover:bg-pink-50/50'}`}
              >
                <GraduationCap className="h-6 w-6 mr-3 text-gray-700" />
                <div>
                  <div className="font-semibold text-lg">{teacher.name}</div>
                  <div className="text-gray-600">{teacher.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Diğer Branşlar ve Öğretmenler */}
        {Object.entries(groupedTeachers)
          .filter(([subject]) => subject !== 'Okul Yönetimi')
          .map(([subject, teachers]) => (
            <div key={subject} className="border-b last:border-none">
              <button
                className="w-full p-4 text-xl font-semibold bg-white flex items-center justify-between focus:outline-none hover:bg-gray-50/50 transition duration-200"
                onClick={() => toggleSection(subject)}
              >
                {subject}
                {openSections[subject] ?? false ? (
                  <ChevronUp className="h-5 w-5 text-gray-700" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-700" />
                )}
              </button>

              <div
                className={`overflow-y-auto transition-all duration-300 ${
                  openSections[subject] ?? false ? 'max-h-[600px]' : 'max-h-0'
                }`}
              >
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className={`p-4 flex items-center transition duration-200 cursor-pointer
                      ${teacher.gender === 'male' ? 'hover:bg-blue-50/50' : 'hover:bg-pink-50/50'}`}
                  >
                    <GraduationCap className="h-5 w-5 mr-3 text-gray-700" />
                    <div className="font-medium">{teacher.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Teachers;