import { useState, useEffect, useCallback } from 'react';
import './ImageCarousel.scss';
import { doctorsImages } from '../../assets/images/doctors/doctorsImages';

interface ImageCarouselProps {
    autoPlayInterval?: number;
}

const ImageCarousel = ({ autoPlayInterval = 4000 }: ImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % doctorsImages.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [doctorsImages.length, isTransitioning]);

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentIndex) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    useEffect(() => {
        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
    }, [goToNext, autoPlayInterval]);

    return (
        <div className="image-carousel">
            <div className="carousel-container">
                <div 
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {doctorsImages.map((image, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={image.src} alt={`Slide ${index + 1}`} />
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
