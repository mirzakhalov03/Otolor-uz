import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { categories, services } from './data/servicesData';
import { type ServiceCategory } from './types/service.types';
import Spinner from '../../components/spinner/Spinner';
import './services.scss';

const Services = () => {
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(categories[0].id);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const filteredServices = selectedCategory
        ? services.filter(service => service.category === selectedCategory)
        : [];

    if (isLoading) {
        return (
            <div className='services'>
                <div className='container'>
                    <div className='services-loading'>
                        <Spinner size='lg' />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='services'>
            <div className='container'>
                <h1 className='services-title'>Xizmatlarimiz</h1>
                <p className='services-subtitle'>
                    Quloq, burun va tomoq kasalliklarini davolashda professional xizmatlar
                </p>

                {/* Category Selection */}
                <div className='services-wrapper'>
                    <div className='category-section'>
                        <h2 className='section-title'>Kategoriyani tanlang</h2>
                        <div className='category-grid'>
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                    role='button'
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(category.id)}
                                >
                                    {selectedCategory === category.id && (
                                        <div className='check-icon'>
                                            <CheckCircle size={24} />
                                        </div>
                                    )}
                                    <div className='category-icon'>{category.icon}</div>
                                    <h3 className='category-title'>{category.title}</h3>
                                    <p className='category-description'>{category.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services Display */}
                    {selectedCategory && (
                        <div className='services-section'>
                            <h2 className='section-title'>
                                {categories.find(c => c.id === selectedCategory)?.title} xizmatlari
                            </h2>
                            <div className='services-table'>
                                <div className='table-header'>
                                    <div className='table-cell header-cell'>№</div>
                                    <div className='table-cell header-cell'>Xizmat nomi</div>
                                    <div className='table-cell header-cell'>Narxi</div>
                                </div>
                                <div className='table-body'>
                                    {filteredServices.map((service, index) => (
                                        <div key={service.id} className='table-row'>
                                            <div className='table-cell number-cell'>{index + 1}</div>
                                            <div className='table-cell name-cell'>{service.name}</div>
                                            <div className='table-cell price-cell'>{service.price} so'm</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!selectedCategory && (
                        <div className='empty-state'>
                            <div className='empty-state-icon'>🏥</div>
                            <h3 className='empty-state-title'>Kategoriyani tanlang</h3>
                            <p className='empty-state-description'>
                                Xizmatlarni ko'rish uchun yuqoridagi kategoriyalardan birini tanlang
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;