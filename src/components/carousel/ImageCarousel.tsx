import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './ImageCarousel.scss';
import { doctorsImages } from '../../assets/images/doctors/doctorsImages';

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
    
    const totalSlides = useMemo(() => doctorsImages.length, []);

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
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {doctorsImages.map((image, index) => (
                        <div key={index} className="carousel-slide">
                            <img
                                src={image.src}
                                alt={image.alt || `Slide ${index + 1}`}
                                loading={index <= 1 ? 'eager' : 'lazy'}
                                decoding="async"
                            />
                            {showDoctorInfo && (
                                <div className="carousel-doctor-info">
                                    <div className="carousel-status-badge">
                                        <span className="carousel-status-dot" />
                                        AVAILABLE TODAY
                                    </div>
                                    <div className="carousel-doctor-name">{image.name}</div>
                                    <div className="carousel-doctor-title">{image.title}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-dots">
                {doctorsImages.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
