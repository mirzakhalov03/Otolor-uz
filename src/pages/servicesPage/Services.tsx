import { useState, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type IService } from './types/service.types';
import Spinner from '../../components/spinner/Spinner';
import './services.scss';
import { useService } from '@/mocks/uiApi';

const Services = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useService();

    const apiServices: IService[] = useMemo(() => {
        return (data as any)?.data?.services || [];
    }, [data]);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(apiServices.map(s => s.category))).filter(Boolean);
        return cats.map(c => ({
            id: c,
            title: c,
            description: '' 
        }));
    }, [apiServices]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const activeCategory = selectedCategory ?? categories[0]?.id ?? null;

    const filteredServices = useMemo(() => {
        return activeCategory
            ? apiServices.filter(service => service.category === activeCategory)
            : [];
    }, [apiServices, activeCategory]);

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
                <h1 className='services-title'>{t('servicesPage.title')}</h1>
                <p className='services-subtitle'>
                    {t('servicesPage.subtitle')}
                </p>

                {/* Category Selection */}
                <div className='services-wrapper'>
                    <div className='category-section'>
                        <h2 className='section-title'>{t('servicesPage.categoryTitle')}</h2>
                        <div className='category-grid'>
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`category-card ${activeCategory === category.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                    role='button'
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(category.id)}
                                >
                                    {activeCategory === category.id && (
                                        <div className='check-icon'>
                                            <CheckCircle size={24} />
                                        </div>
                                    )}
                                    <h3 className='category-title'>{category.title}</h3>
                                    <p className='category-description'>{category.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services Display */}
                    {activeCategory && (
                        <div className='services-section'>
                            <h2 className='section-title'>
                                {categories.find(c => c.id === activeCategory)?.title} {t('servicesPage.servicesTitle')}
                            </h2>
                            <div className='services-table'>
                                <div className='table-header'>
                                    <div className='table-cell header-cell'>{t('servicesPage.tableNumber')}</div>
                                    <div className='table-cell header-cell'>{t('servicesPage.tableName')}</div>
                                    <div className='table-cell header-cell'>{t('servicesPage.tablePrice')}</div>
                                </div>
                                <div className='table-body'>
                                    {filteredServices.map((service, index) => (
                                        <div key={service._id} className='table-row'>
                                            <div className='table-cell number-cell'>{index + 1}</div>
                                            <div className='table-cell name-cell'>{service.serviceName}</div>
                                            <div className='table-cell price-cell'>{service.price?.toLocaleString()} {t('servicesPage.currency')}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!activeCategory && (
                        <div className='empty-state'>
                            <div className='empty-state-icon'>{t('servicesPage.emptyStateIcon')}</div>
                            <h3 className='empty-state-title'>{t('servicesPage.emptyStateTitle')}</h3>
                            <p className='empty-state-description'>
                                {t('servicesPage.emptyStateDesc')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;