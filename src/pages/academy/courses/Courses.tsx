import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

const Courses = () => {
  const { t } = useTranslation()
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phoneNumber: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleScrollToVideos = () => {
    const videoSection = document.getElementById('academy-courses-videos')
    videoSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const bannerStats = [
    {
      id: 1,
      value: t('academyCourses.stats.stat1Value'),
      label: t('academyCourses.stats.stat1Label')
    },
    {
      id: 2,
      value: t('academyCourses.stats.stat2Value'),
      label: t('academyCourses.stats.stat2Label')
    },
    {
      id: 3,
      value: t('academyCourses.stats.stat3Value'),
      label: t('academyCourses.stats.stat3Label')
    }
  ]

  const videos = [
    {
      id: 1,
      title: t('academyCourses.videos.video1Title'),
      src: 'https://www.youtube.com/embed/-tngi6x3usI'
    },
    {
      id: 2,
      title: t('academyCourses.videos.video2Title'),
      src: 'https://www.youtube.com/embed/m9V2MRUAmR0'
    },
    {
      id: 3,
      title: t('academyCourses.videos.video3Title'),
      src: 'https://www.youtube.com/embed/4fmGZIWflXI'
    },
    {
      id: 4,
      title: t('academyCourses.videos.video4Title'),
      src: 'https://www.youtube.com/embed/jLp9lcb4Dfk'
    },
    {
      id: 5,
      title: t('academyCourses.videos.video5Title'),
      src: 'https://www.youtube.com/embed/HjrbKL0shIg'
    },
    {
      id: 6,
      title: t('academyCourses.videos.video6Title'),
      src: 'https://www.youtube.com/embed/FyFGoOu8X4Y'
    }
  ]

  const otherCourses = [
    {
      id: 1,
      title: t('academyCourses.otherCourses.courses.course1Title'),
      type: 'free',
      level: t('academyCourses.otherCourses.levels.beginner'),
      access: t('academyCourses.otherCourses.access.open'),
      link: 'https://www.youtube.com/watch?v=-tngi6x3usI'
    },
    {
      id: 2,
      title: t('academyCourses.otherCourses.courses.course2Title'),
      type: 'paid',
      level: t('academyCourses.otherCourses.levels.intermediate'),
      access: t('academyCourses.otherCourses.access.premium'),
      link: 'https://www.youtube.com/watch?v=m9V2MRUAmR0'
    },
    {
      id: 3,
      title: t('academyCourses.otherCourses.courses.course3Title'),
      type: 'paid',
      level: t('academyCourses.otherCourses.levels.advanced'),
      access: t('academyCourses.otherCourses.access.premium'),
      link: 'https://www.youtube.com/watch?v=4fmGZIWflXI'
    },
    {
      id: 4,
      title: t('academyCourses.otherCourses.courses.course4Title'),
      type: 'free',
      level: t('academyCourses.otherCourses.levels.intermediate'),
      access: t('academyCourses.otherCourses.access.open'),
      link: 'https://www.youtube.com/watch?v=FyFGoOu8X4Y'
    }
  ]

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
    if (isSubmitted) {
      setIsSubmitted(false)
    }
  }

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    setContactForm({
      fullName: '',
      phoneNumber: '',
      message: ''
    })
  }

  return (
    <div className="min-h-screen bg-[#e9e9e9]">
      <section className="px-6 pt-[8.5rem] pb-6 max-[900px]:pt-[7.5rem]">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#165b35] via-[#1d7a43] to-[#2db866] px-8 py-10 text-white shadow-md max-[900px]:px-5 max-[900px]:py-7">
            <div className="pointer-events-none absolute -left-20 bottom-[-90px] h-[220px] w-[220px] rounded-full bg-white/20 blur-2xl" />
            <div className="pointer-events-none absolute -right-16 top-[-80px] h-[220px] w-[220px] rounded-full bg-white/20 blur-2xl" />

            <div className="relative z-[1]">
              <p className="m-0 inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[0.95rem] font-semibold text-white/95">
                {t('academyCourses.bannerTag')}
              </p>
              <h1 className="mt-5 mb-0 max-w-[980px] text-[3.65rem] leading-[1.15] font-semibold text-white max-[1200px]:text-[3rem] max-[900px]:text-[2rem]">
                {t('academyCourses.bannerTitle')}
              </h1>
              <p className="mt-5 mb-0 max-w-[890px] text-[1.18rem] leading-[1.65] text-white/90 max-[900px]:text-[1.02rem]">
              {t('academyCourses.bannerDescription')}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {bannerStats.map((item) => (
                  <div key={item.id} className="min-w-[190px] rounded-2xl border border-white/15 bg-white/10 px-5 py-4 max-[900px]:min-w-[150px]">
                    <p className="m-0 text-[2rem] leading-[1.2] font-bold text-white max-[900px]:text-[1.65rem]">{item.value}</p>
                    <p className="mt-1.5 mb-0 text-[1.04rem] text-white/90 max-[900px]:text-[0.95rem]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleScrollToVideos}
                  className="rounded-xl border-0 bg-[#155d34] px-7 py-3.5 text-[1.2rem] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#104c2a]"
                >
                  {t('academyCourses.primaryButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="academy-courses-videos" className="px-6 pt-2 pb-12 max-[900px]:pt-2">
        <div className="container">
          <h2 className="m-0 mb-4 text-[2.2rem] leading-[1.2] font-bold text-[#3f3f3f]">{t('academyCourses.videoSectionTitle')}</h2>
          <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
            {videos.map((video) => (
              <article key={video.id} className="overflow-hidden rounded-xl bg-[#111]">
                <iframe
                  src={video.src}
                  title={video.title}
                  className="block aspect-video w-full border-0 rounded-lg"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-1 pb-16">
        <div className="container">
          <div className="rounded-3xl bg-[#f4f4f4] p-6 shadow-sm max-[900px]:p-4">
            <h2 className="m-0 text-[2rem] leading-[1.2] font-bold text-[#2f2f2f] max-[900px]:text-[1.7rem]">
              {t('academyCourses.otherCourses.title')}
            </h2>
            <p className="mt-3 mb-0 max-w-[930px] text-[1.03rem] leading-[1.65] text-[#5e5e5e]">
              {t('academyCourses.otherCourses.subtitle')}
            </p>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-[#e2e2e2] bg-white">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="bg-[#f8f8f8] text-left">
                    <th className="px-4 py-3 text-[0.96rem] font-semibold text-[#4b4b4b]">{t('academyCourses.otherCourses.table.course')}</th>
                    <th className="px-4 py-3 text-[0.96rem] font-semibold text-[#4b4b4b]">{t('academyCourses.otherCourses.table.type')}</th>
                    <th className="px-4 py-3 text-[0.96rem] font-semibold text-[#4b4b4b]">{t('academyCourses.otherCourses.table.level')}</th>
                    <th className="px-4 py-3 text-[0.96rem] font-semibold text-[#4b4b4b]">{t('academyCourses.otherCourses.table.access')}</th>
                    <th className="px-4 py-3 text-[0.96rem] font-semibold text-[#4b4b4b]">{t('academyCourses.otherCourses.table.link')}</th>
                  </tr>
                </thead>
                <tbody>
                  {otherCourses.map((course) => (
                    <tr key={course.id} className="border-t border-[#ededed]">
                      <td className="px-4 py-3 text-[0.98rem] font-medium text-[#303030]">{course.title}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[0.84rem] font-semibold ${course.type === 'free' ? 'bg-[#e7f8ec] text-[#1a8d4a]' : 'bg-[#fff0e4] text-[#bf6b2a]'}`}>
                          {course.type === 'free' ? t('academyCourses.otherCourses.types.free') : t('academyCourses.otherCourses.types.paid')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[0.95rem] text-[#505050]">{course.level}</td>
                      <td className="px-4 py-3 text-[0.95rem] text-[#505050]">{course.access}</td>
                      <td className="px-4 py-3">
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg bg-[#1b7340] px-3.5 py-2 text-[0.88rem] font-semibold text-white transition-all duration-200 hover:bg-[#155c33]"
                        >
                          {t('academyCourses.otherCourses.table.viewCourse')}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-2xl border border-[#d9ebde] bg-[#f7fcf9] p-5 max-[900px]:p-4">
              <h3 className="m-0 text-[1.45rem] leading-[1.25] font-bold text-[#2f2f2f]">
                {t('academyCourses.contactForm.title')}
              </h3>
              <p className="mt-2 mb-0 max-w-[760px] text-[1rem] leading-[1.65] text-[#5e5e5e]">
                {t('academyCourses.contactForm.subtitle')}
              </p>

              <form className="mt-5 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1" onSubmit={handleContactSubmit}>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.93rem] font-semibold text-[#474747]">{t('academyCourses.contactForm.fullNameLabel')}</span>
                  <input
                    type="text"
                    name="fullName"
                    value={contactForm.fullName}
                    onChange={handleInputChange}
                    placeholder={t('academyCourses.contactForm.fullNamePlaceholder')}
                    required
                    className="h-12 rounded-xl border border-[#d9d9d9] bg-white px-3.5 text-[0.98rem] text-[#323232] outline-none transition-all focus:border-[#1f7d46]"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.93rem] font-semibold text-[#474747]">{t('academyCourses.contactForm.phoneLabel')}</span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={contactForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={t('academyCourses.contactForm.phonePlaceholder')}
                    required
                    className="h-12 rounded-xl border border-[#d9d9d9] bg-white px-3.5 text-[0.98rem] text-[#323232] outline-none transition-all focus:border-[#1f7d46]"
                  />
                </label>

                <label className="col-span-2 flex flex-col gap-1.5 max-[900px]:col-span-1">
                  <span className="text-[0.93rem] font-semibold text-[#474747]">{t('academyCourses.contactForm.messageLabel')}</span>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder={t('academyCourses.contactForm.messagePlaceholder')}
                    required
                    rows={4}
                    className="rounded-xl border border-[#d9d9d9] bg-white px-3.5 py-3 text-[0.98rem] text-[#323232] outline-none transition-all focus:border-[#1f7d46]"
                  />
                </label>

                <div className="col-span-2 flex items-center justify-between gap-3 max-[900px]:col-span-1 max-[900px]:flex-col max-[900px]:items-start">
                  <button
                    type="submit"
                    className="rounded-xl border-0 bg-[#1b7340] px-6 py-3 text-[1rem] font-semibold text-white transition-all duration-200 hover:bg-[#155c33]"
                  >
                    {t('academyCourses.contactForm.submitButton')}
                  </button>
                  {isSubmitted && <p className="m-0 text-[0.95rem] font-medium text-[#1a8d4a]">{t('academyCourses.contactForm.successMessage')}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses
