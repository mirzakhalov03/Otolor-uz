import { Play } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

const Courses = () => {
  const { t } = useTranslation()
  const [loadedVideoIds, setLoadedVideoIds] = useState<number[]>([])
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phoneNumber: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleScrollToVideos = () => {
    const videoSection = document.getElementById('academy-courses-videos')
    videoSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const bannerStats = [
    {
      id: 1,
      value: t('academyCourses.stats.stat1Value'),
      label: t('academyCourses.stats.stat1Label')
    }
  ]

  const videos = [
    {
      id: 1,
      youtubeId: '-tngi6x3usI',
      title: t('academyCourses.videos.video1Title'),
      src: 'https://www.youtube.com/embed/-tngi6x3usI'
    },
    {
      id: 2,
      youtubeId: 'm9V2MRUAmR0',
      title: t('academyCourses.videos.video2Title'),
      src: 'https://www.youtube.com/embed/m9V2MRUAmR0'
    },
    {
      id: 3,
      youtubeId: '4fmGZIWflXI',
      title: t('academyCourses.videos.video3Title'),
      src: 'https://www.youtube.com/embed/4fmGZIWflXI'
    },
    {
      id: 4,
      youtubeId: 'jLp9lcb4Dfk',
      title: t('academyCourses.videos.video4Title'),
      src: 'https://www.youtube.com/embed/jLp9lcb4Dfk'
    },
    {
      id: 5,
      youtubeId: 'HjrbKL0shIg',
      title: t('academyCourses.videos.video5Title'),
      src: 'https://www.youtube.com/embed/HjrbKL0shIg'
    },
    {
      id: 6,
      youtubeId: 'FyFGoOu8X4Y',
      title: t('academyCourses.videos.video6Title'),
      src: 'https://www.youtube.com/embed/FyFGoOu8X4Y'
    }
  ]

  // const otherCourses = [
  //   {
  //     id: 1,
  //     title: t('academyCourses.otherCourses.courses.course1Title'),
  //     type: 'free',
  //     level: t('academyCourses.otherCourses.levels.beginner'),
  //     link: 'https://www.youtube.com/watch?v=-tngi6x3usI'
  //   },
  //   {
  //     id: 2,
  //     title: t('academyCourses.otherCourses.courses.course2Title'),
  //     type: 'paid',
  //     level: t('academyCourses.otherCourses.levels.intermediate'),
  //     link: 'https://www.youtube.com/watch?v=m9V2MRUAmR0'
  //   },
  //   {
  //     id: 3,
  //     title: t('academyCourses.otherCourses.courses.course3Title'),
  //     type: 'paid',
  //     level: t('academyCourses.otherCourses.levels.advanced'),
  //     link: 'https://www.youtube.com/watch?v=4fmGZIWflXI'
  //   },
  //   {
  //     id: 4,
  //     title: t('academyCourses.otherCourses.courses.course4Title'),
  //     type: 'free',
  //     level: t('academyCourses.otherCourses.levels.intermediate'),
  //     link: 'https://www.youtube.com/watch?v=FyFGoOu8X4Y'
  //   }
  // ]

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
    if (isSubmitted) {
      setIsSubmitted(false)
    }
  }

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const botToken =
      (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined) ||
      (import.meta.env.VITE_BOT_TOKEN as string | undefined)
    const chatIdsRaw =
      (import.meta.env.VITE_TELEGRAM_CHAT_IDS as string | undefined) ||
      (import.meta.env.VITE_CHAT_ID as string | undefined)

    const chatIds = (chatIdsRaw || '')
      .split(',')
      .map((chatId) => chatId.trim())
      .filter(Boolean)

    if (!botToken || chatIds.length === 0) {
      setIsSubmitted(false)
      setSubmitError('Telegram bot is not configured. Please contact administrator.')
      return
    }

    const message = `
🆕 Yangi foydalanuvchi:

👤 To'liq ismi: ${contactForm.fullName}
📞 Telefon: ${contactForm.phoneNumber}
💬 Xabar: ${contactForm.message}
    `

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      await Promise.all(
        chatIds.map(async (chatId) => {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message }),
          })

          const result = (await response.json()) as { ok?: boolean; description?: string }
          if (!response.ok || !result.ok) {
            throw new Error(result.description || 'Telegram API returned non-OK response')
          }
        })
      )

      setIsSubmitted(true)
      setContactForm({
        fullName: '',
        phoneNumber: '',
        message: ''
      })
    } catch {
      setIsSubmitted(false)
      setSubmitError('Xabar yuborilmadi. Iltimos, qayta urinib ko\'ring.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoadVideo = (videoId: number) => {
    setLoadedVideoIds((prev) => (prev.includes(videoId) ? prev : [...prev, videoId]))
  }

  return (
    <div className="min-h-screen bg-[#e9e9e9]">
      <section className="px-6 pt-34 pb-6 max-[900px]:px-2 max-[900px]:pt-[7.5rem]">
        <div className="container max-[900px]:px-0">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#165b35] via-[#1d7a43] to-[#2db866] px-8 py-10 text-white shadow-md max-[900px]:px-4 max-[900px]:py-7">
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

      <section id="academy-courses-videos" className="px-6 pt-2 pb-12 max-[900px]:px-2 max-[900px]:pt-2">
        <div className="container max-[900px]:px-0">
          <h2 className="m-0 mb-4 text-[2.2rem] leading-[1.2] font-bold text-[#3f3f3f]">{t('academyCourses.videoSectionTitle')}</h2>
          <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
            {videos.map((video) => (
              <article key={video.id} className="overflow-hidden rounded-xl bg-[#111]">
                {loadedVideoIds.includes(video.id) ? (
                  <iframe
                    src={`${video.src}?autoplay=1`}
                    title={video.title}
                    className="block aspect-video w-full border-0 rounded-lg"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLoadVideo(video.id)}
                    className="relative block aspect-video w-full border-0 bg-[#111] p-0 text-left"
                    aria-label={video.title}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 bg-black/15" />
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90">
                      <Play/>
                    </span>
                    <span className="absolute bottom-3 left-3 right-3 text-[0.95rem] font-medium text-white">
                      {video.title}
                    </span>
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-1 pb-16 max-[900px]:px-2">
        <div className="container max-[900px]:px-0">
          <div className="rounded-3xl bg-[#f4f4f4] p-6 shadow-sm max-[900px]:p-4">
            <div className="mt-8 rounded-2xl border border-[#d9ebde] bg-[#f7fcf9] p-5 max-[900px]:p-4">
              <h3 className="m-0 text-[1.45rem] leading-tight font-bold text-[#2f2f2f]">
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
                    disabled={isSubmitting}
                    className="rounded-xl border-0 bg-[#1b7340] px-6 py-3 text-[1rem] font-semibold text-white transition-all duration-200 hover:bg-[#155c33]"
                  >
                    {isSubmitting ? `${t('academyCourses.contactForm.submitButton')}...` : t('academyCourses.contactForm.submitButton')}
                  </button>
                  {isSubmitted && <p className="m-0 text-[0.95rem] font-medium text-[#1a8d4a]">{t('academyCourses.contactForm.successMessage')}</p>}
                  {submitError && <p className="m-0 text-[0.95rem] font-medium text-[#bf2a2a]">{submitError}</p>}
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
