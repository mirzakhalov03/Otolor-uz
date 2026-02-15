import { Award, Shield, Microscope, CheckCircle2 } from 'lucide-react';
import Button from '../../components/buttons/Button';
import { doctorsImages } from '../../assets/images/doctors/doctorsImages';
import heroBg from '../../assets/images/otolor-hero-bg.png';
import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-page__hero">
        <img src={heroBg} alt="Otolor Hero" className="about-page__hero-bg" />
        <div className="about-page__hero-content container">
          <h1 className="about-page__hero-title">Otolor – Salomatligingiz Bizning Ustuvor Vazifamiz</h1>
          <p className="about-page__hero-subtitle">
            15 yildan ortiq tajribaga ega zamonaviy LOR klinikasi.
            Sizga eng yaxshi tibbiy xizmatni ko'rsatishga tayyormiz.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-page__section">
        <div className="container">
          <div className="about-page__grid">
            <div className="about-page__image-wrapper">
              <img src={doctorsImages[0].src} alt="Our Clinic" />
            </div>
            <div className="about-page__content">
              <span className="section-tag">Biz haqimizda</span>
              <h2 className="section-title">Otolor LOR klinikasi – Ishonchli va tajribali jamoa</h2>
              <p className="section-desc">
                Otolor klinikasi ko'p yillar davomida quloq, burun va tomoq kasalliklarini tashxislash
                va davolash sohasida peshqadamlik qilib kelmoqda. Bizning shifoxonamiz zamonaviy
                tibbiy uskunalar bilan jihozlangan bo'lib, har bir bemorga individual yondashuvni kafolatlaymiz.
              </p>
              <p className="section-desc">
                Biz nafaqat davolaymiz, balki profilaktika va sog'lom turmush tarzini targ'ib qilishga ham
                alohida e'tibor qaratamiz. Malakali mutaxassislarimiz dunyoning yetakchi klinikalari
                tajribasini qo'llagan holda xizmat ko'rsatadilar.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#2DC263]" size={20} />
                  <span className="text-gray-700">Eng so'nggi rusumdagi tibbiy uskunalar</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#2DC263]" size={20} />
                  <span className="text-gray-700">Yuqori malakali LOR shifokorlari</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#2DC263]" size={20} />
                  <span className="text-gray-700">Dunyodagi eng yaxshi davolash usullari</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-page__section about-page__section--gray">
        <div className="container text-center">
          <span className="section-tag">Qadriyatlarimiz</span>
          <h2 className="section-title">Biz nimaga ishonamiz?</h2>

          <div className="about-page__values">
            <div className="about-page__values-card">
              <div className="card-icon"><Award /></div>
              <h3 className="card-title">Professionalizm</h3>
              <p className="card-desc">Bizning barcha shifokorlarimiz o'z sohasining mutaxassislari va muntazam malaka oshirib boradilar.</p>
            </div>
            <div className="about-page__values-card">
              <div className="card-icon"><Microscope /></div>
              <h3 className="card-title">Innovatsiya</h3>
              <p className="card-desc">Biz faqat eng yangi va samarali texnologiyalardan foydalangan holda davolaymiz.</p>
            </div>
            <div className="about-page__values-card">
              <div className="card-icon"><Shield /></div>
              <h3 className="card-title">Xavfsizlik</h3>
              <p className="card-desc">Bemorlar xavfsizligi va qulayligi biz uchun eng muhim mezondir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="about-page__section">
        <div className="container">
          <div className="about-page__stats">
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">15+</span>
              <span className="about-page__stats-label">Yillik tajriba</span>
            </div>
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">20,000+</span>
              <span className="about-page__stats-label">Sog'aygan bemorlar</span>
            </div>
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">40+</span>
              <span className="about-page__stats-label">Professional shifokorlar</span>
            </div>
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">10+</span>
              <span className="about-page__stats-label">Klinika filiallari</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Highlights Section */}
      <section className="about-page__section about-page__section--gray">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-tag">Jamoamiz</span>
            <h2 className="section-title">Bizning Yetakchi Mutaxassislar</h2>
          </div>

          <div className="about-page__team-grid">
            {doctorsImages.slice(0, 4).map((member, index) => (
              <div key={index} className="about-page__team-member">
                <div className="member-image">
                  <img src={member.src} alt={member.alt} />
                </div>
                <h3 className="member-name">{member.alt || `Mutaxassis ${index + 1}`}</h3>
                <p className="member-role">LOR Shifokori</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-page__section">
        <div className="container">
          <div className="bg-[#2DC263] rounded-[32px] p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Salomatligingizni professionallarga ishonib topshiring</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Bizning klinikamizda siz eng yuqori darajadagi xizmatdan bahramand bo'lasiz.
                Hoziroq ko'rikka yoziling!
              </p>
              <Button
                color="white"
                className="text-[#2DC263] bg-white px-10 py-6 rounded-full font-bold hover:scale-105 transition-all text-lg"
              >
                Ko'rikka yozilish
              </Button>
            </div>
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;