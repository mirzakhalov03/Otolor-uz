import { Clock3, Star, Users2, CheckCircle2, PlayCircle, ShieldCheck, BadgeCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/buttons/Button'
import './Courses.scss'

const Courses = () => {
  const { t } = useTranslation()

  const courses = [
    {
      id: 1,
      title: 'Endoscopic Sinus Surgery Masterclass',
      subtitle: 'From diagnosis to post-op protocol with real operating room workflow.',
      level: 'Advanced',
      duration: '8 weeks',
      lessons: 42,
      students: 312,
      price: '$299'
    },
    {
      id: 2,
      title: 'Pediatric ENT Clinical Bootcamp',
      subtitle: 'Evidence-based pediatric ENT care for daily outpatient and emergency cases.',
      level: 'Intermediate',
      duration: '6 weeks',
      lessons: 28,
      students: 485,
      price: '$219'
    },
    {
      id: 3,
      title: 'Hearing Restoration and Otology Essentials',
      subtitle: 'Audiology interpretation, treatment pathways, and surgical decision-making.',
      level: 'Beginner',
      duration: '5 weeks',
      lessons: 24,
      students: 579,
      price: '$169'
    }
  ]

  const outcomes = [
    'Step-by-step ENT treatment frameworks you can apply immediately',
    'Case-based decision making from real patient scenarios',
    'Downloadable checklists and treatment protocols',
    'Certificate of completion for each course',
  ]

  return (
    <div className="courses-page">
      <section className="courses-hero">
        <div className="courses-hero__glow courses-hero__glow--left" />
        <div className="courses-hero__glow courses-hero__glow--right" />

        <div className="container courses-hero__content">
          <span className="courses-hero__badge">
            <BadgeCheck size={18} />
            {t('nav.academy')} · {t('nav.courses')}
          </span>
          <h1>Master modern ENT practice with practical online courses</h1>
          <p>
            Learn directly from high-volume specialists through structured modules, live sessions, and
            clinic-grade materials designed for doctors who want measurable outcomes.
          </p>

          <div className="courses-hero__stats">
            <div>
              <strong>1,300+</strong>
              <span>Active learners</span>
            </div>
            <div>
              <strong>95%</strong>
              <span>Completion rate</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Average rating</span>
            </div>
          </div>

          <div className="courses-hero__actions">
            <Button>Explore Programs</Button>
            <Button className="courses-btn courses-btn--ghost">
              <PlayCircle size={16} />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="courses-listing">
        <div className="container">
          <div className="courses-listing__header">
            <h2>Featured programs</h2>
            <p>Pick your track and start learning with weekly mentorship and lifetime access.</p>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <article key={course.id} className="course-card">
                <div className="course-card__head">
                  <span className="course-card__level">{course.level}</span>
                  <span className="course-card__rating">
                    <Star size={14} /> 4.9
                  </span>
                </div>

                <h3>{course.title}</h3>
                <p>{course.subtitle}</p>

                <ul className="course-card__meta">
                  <li>
                    <Clock3 size={16} /> {course.duration}
                  </li>
                  <li>
                    <CheckCircle2 size={16} /> {course.lessons} lessons
                  </li>
                  <li>
                    <Users2 size={16} /> {course.students} students
                  </li>
                </ul>

                <div className="course-card__footer">
                  <div className="course-card__price">
                    <span>from</span>
                    <strong>{course.price}</strong>
                  </div>
                  <Button>Buy Course</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="courses-benefits">
        <div className="container courses-benefits__content">
          <div>
            <h2>What you get after enrollment</h2>
            <ul>
              {outcomes.map((outcome) => (
                <li key={outcome}>
                  <CheckCircle2 size={18} />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="courses-benefits__card">
            <ShieldCheck size={28} />
            <h3>30-day learning guarantee</h3>
            <p>
              If the course does not match your expectations within the first 30 days, we offer a full refund.
            </p>
            <Button className="primary">View Enrollment Policy</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses