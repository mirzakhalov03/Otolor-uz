import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './ImageCarousel.scss';
import { doctorsImages, type DoctorImage } from '../../assets/images/doctors/doctorsImages';
import { useDoctors } from '@/api/query/useDoctors';

interface ImageCarouselProps {
    autoPlayInterval?: number;
    showDoctorInfo?: boolean;
    height?: number | string;
}

const ImageCarousel = ({ autoPlayInterval = 4000, showDoctorInfo = false, height }: ImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
    const [isInViewport, setIsInViewport] = useState(true);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const { data: doctors } = useDoctors();

    // Keep all the pre-filled/static doctors and append any newly-added
    // doctors that have an uploaded photo, so admin additions show up here too.
    const slides: DoctorImage[] = useMemo(() => {
        const liveWithPhoto = (doctors ?? [])
            .filter((d) => d.avatarUrl)
            .map((d) => ({
                src: d.avatarUrl as string,
                alt: d.name,
                name: d.name,
                title: d.specialization || '',
            }));
        // Dedupe by image src so the same photo never appears twice.
        const seen = new Set(doctorsImages.map((i) => i.src));
        const extra = liveWithPhoto.filter((i) => !seen.has(i.src));
        return [...doctorsImages, ...extra];
    }, [doctors]);

    const totalSlides = slides.length;

    // Clamp the active index during render so a changing slide source
    // (e.g. live data arriving) can never leave us pointing past the end —
    // avoids a setState-in-effect round trip.
    const activeIndex = totalSlides > 0 ? currentIndex % totalSlides : 0;

    const goToNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [totalSlides, isTransitioning]);

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentIndex) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (!rootRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInViewport(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        observer.observe(rootRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isPageVisible || !isInViewport) return;
        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
    }, [goToNext, autoPlayInterval, isPageVisible, isInViewport]);

    const carouselStyle = height ? { 
        height: typeof height === 'number' ? `${height}px` : height 
    } : undefined;

    return (
        <div className="image-carousel" style={carouselStyle} ref={rootRef}>
            <div className="carousel-container">
                <div 
                    className="carousel-track"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {slides.map((image, index) => (
                        <div key={index} className="carousel-slide">
                            <img
                                src={image.src}
                                alt={image.alt || `Slide ${index + 1}`}
                                loading={index <= 1 ? 'eager' : 'lazy'}
                                decoding="async"
                            />
                            {showDoctorInfo && (
                                <div className="carousel-doctor-info">
                                    <div className="carousel-doctor-name">{image.name}</div>
                                    <div className="carousel-doctor-title">{image.title}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
