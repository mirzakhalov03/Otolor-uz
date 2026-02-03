import './AboutUs.scss';

const AboutUs = () => {
    return (
        <section className="about-us">
            <div className="about-us__container container">
                <div className="about-us__content">
                    <h2 className="about-us__title">О нас</h2>
                    <p className="about-us__description">
                        Мы — команда высококвалифицированных специалистов, предоставляющих качественные медицинские услуги.
                        Наша клиника оснащена современным оборудованием и использует передовые методы лечения.
                        Мы заботимся о здоровье каждого пациента и стремимся обеспечить комфортное и эффективное лечение.
                    </p>
                    <p className="about-us__description">
                        С многолетним опытом работы в области отоларингологии, мы гордимся тем, что помогаем людям
                        вернуть здоровье и улучшить качество жизни. Наши врачи постоянно повышают квалификацию и
                        следят за новейшими достижениями в медицине.
                    </p>
                    <div className="about-us__stats">
                        <div className="about-us__stat">
                            <div className="about-us__stat-number">15+</div>
                            <div className="about-us__stat-label">Лет опыта</div>
                        </div>
                        <div className="about-us__stat">
                            <div className="about-us__stat-number">10000+</div>
                            <div className="about-us__stat-label">Довольных пациентов</div>
                        </div>
                        <div className="about-us__stat">
                            <div className="about-us__stat-number">50+</div>
                            <div className="about-us__stat-label">Специалистов</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
