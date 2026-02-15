import { BookOpen, GraduationCap, Award, Video, FileText, Users, Calendar, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/buttons/Button';
import './Academy.scss';

const Academy = () => {
  const { t } = useTranslation();

  const courses = [
    {
      id: 1,
      title: t('academy.course1Title'),
      duration: t('academy.duration', { hours: 40 }),
      level: t('academy.levelAdvanced'),
      students: 450,
      image: '/placeholder-course-1.jpg',
      category: 'surgery'
    },
    {
      id: 2,
      title: t('academy.course2Title'),
      duration: t('academy.duration', { hours: 30 }),
      level: t('academy.levelIntermediate'),
      students: 320,
      image: '/placeholder-course-2.jpg',
      category: 'diagnosis'
    },
    {
      id: 3,
      title: t('academy.course3Title'),
      duration: t('academy.duration', { hours: 25 }),
      level: t('academy.levelBeginner'),
      students: 580,
      image: '/placeholder-course-3.jpg',
      category: 'pediatric'
    },
    {
      id: 4,
      title: t('academy.course4Title'),
      duration: t('academy.duration', { hours: 35 }),
      level: t('academy.levelAdvanced'),
      students: 210,
      image: '/placeholder-course-4.jpg',
      category: 'hearing'
    }
  ];

  const books = [
    {
      id: 1,
      title: t('academy.book1Title'),
      author: t('academy.book1Author'),
      pages: 420,
      year: 2024,
      cover: '/placeholder-book-1.jpg'
    },
    {
      id: 2,
      title: t('academy.book2Title'),
      author: t('academy.book2Author'),
      pages: 380,
      year: 2023,
      cover: '/placeholder-book-2.jpg'
    },
    {
      id: 3,
      title: t('academy.book3Title'),
      author: t('academy.book3Author'),
      pages: 510,
      year: 2024,
      cover: '/placeholder-book-3.jpg'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: t('academy.event1Title'),
      date: '2026-03-15',
      time: '10:00 AM',
      format: t('academy.formatOnline')
    },
    {
      id: 2,
      title: t('academy.event2Title'),
      date: '2026-04-20',
      time: '2:00 PM',
      format: t('academy.formatInPerson')
    },
    {
      id: 3,
      title: t('academy.event3Title'),
      date: '2026-05-10',
      time: '9:00 AM',
      format: t('academy.formatHybrid')
    }
  ];

  return (
    <div className="academy-page">
      {/* Hero Section */}
      <section className="academy-hero">
        <div className="academy-hero__overlay"></div>
        <div className="academy-hero__content container">
          <div className="academy-hero__badge">
            <GraduationCap size={24} />
            <span>{t('academy.heroTag')}</span>
          </div>
          <h1 className="academy-hero__title">{t('academy.heroTitle')}</h1>
          <p className="academy-hero__subtitle">{t('academy.heroSubtitle')}</p>
          <div className="academy-hero__stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">{t('academy.studentsEnrolled')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">{t('academy.coursesOffered')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">20+</span>
              <span className="stat-label">{t('academy.expertInstructors')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="academy-section courses-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <BookOpen size={20} />
              <span>{t('academy.coursesTag')}</span>
            </div>
            <h2 className="section-title">{t('academy.coursesTitle')}</h2>
            <p className="section-desc">{t('academy.coursesDesc')}</p>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-card__image">
                  <div className="course-card__image-placeholder">
                    <GraduationCap size={48} />
                  </div>
                  <span className="course-card__category">{course.category}</span>
                </div>
                <div className="course-card__content">
                  <h3 className="course-card__title">{course.title}</h3>
                  <div className="course-card__meta">
                    <span className="meta-item">
                      <Calendar size={16} />
                      {course.duration}
                    </span>
                    <span className="meta-item">
                      <Users size={16} />
                      {course.students} {t('academy.students')}
                    </span>
                  </div>
                  <div className="course-card__footer">
                    <span className="course-card__level">{course.level}</span>
                    <Button className="course-card__btn">{t('academy.learnMore')}</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books & Publications Section */}
      <section className="academy-section books-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <FileText size={20} />
              <span>{t('academy.booksTag')}</span>
            </div>
            <h2 className="section-title">{t('academy.booksTitle')}</h2>
            <p className="section-desc">{t('academy.booksDesc')}</p>
          </div>

          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card__cover">
                  <div className="book-card__cover-placeholder">
                    <BookOpen size={40} />
                  </div>
                </div>
                <div className="book-card__info">
                  <h3 className="book-card__title">{book.title}</h3>
                  <p className="book-card__author">{book.author}</p>
                  <div className="book-card__details">
                    <span>{book.pages} {t('academy.pages')}</span>
                    <span>•</span>
                    <span>{book.year}</span>
                  </div>
                  <Button className="book-card__btn">
                    <Download size={16} />
                    {t('academy.downloadSample')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Resources */}
      <section className="academy-section resources-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Video size={20} />
              <span>{t('academy.resourcesTag')}</span>
            </div>
            <h2 className="section-title">{t('academy.resourcesTitle')}</h2>
          </div>

          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-card__icon">
                <Video size={32} />
              </div>
              <h3 className="resource-card__title">{t('academy.videoLectures')}</h3>
              <p className="resource-card__desc">{t('academy.videoLecturesDesc')}</p>
              <a href="#" className="resource-card__link">{t('academy.explore')} →</a>
            </div>
            <div className="resource-card">
              <div className="resource-card__icon">
                <FileText size={32} />
              </div>
              <h3 className="resource-card__title">{t('academy.researchPapers')}</h3>
              <p className="resource-card__desc">{t('academy.researchPapersDesc')}</p>
              <a href="#" className="resource-card__link">{t('academy.explore')} →</a>
            </div>
            <div className="resource-card">
              <div className="resource-card__icon">
                <Award size={32} />
              </div>
              <h3 className="resource-card__title">{t('academy.certifications')}</h3>
              <p className="resource-card__desc">{t('academy.certificationsDesc')}</p>
              <a href="#" className="resource-card__link">{t('academy.explore')} →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="academy-section events-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Calendar size={20} />
              <span>{t('academy.eventsTag')}</span>
            </div>
            <h2 className="section-title">{t('academy.eventsTitle')}</h2>
          </div>

          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-card__date">
                  <span className="event-card__day">{new Date(event.date).getDate()}</span>
                  <span className="event-card__month">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
                <div className="event-card__content">
                  <h3 className="event-card__title">{event.title}</h3>
                  <div className="event-card__meta">
                    <span>{event.time}</span>
                    <span>•</span>
                    <span className="event-card__format">{event.format}</span>
                  </div>
                </div>
                <Button className="event-card__btn">{t('academy.register')}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="academy-cta">
        <div className="container">
          <div className="academy-cta__content">
            <h2 className="academy-cta__title">{t('academy.ctaTitle')}</h2>
            <p className="academy-cta__desc">{t('academy.ctaDesc')}</p>
            <div className="academy-cta__buttons">
              <Button className="btn-primary">{t('academy.enrollNow')}</Button>
              <Button className="btn-outline">{t('academy.contactUs')}</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academy;
