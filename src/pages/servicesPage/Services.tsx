import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Spinner from '../../components/spinner/Spinner';
import { getCategories } from '@/api/services/categoryService';
import { getServices } from '@/api/services/serviceService';
import heroBg from '../../assets/images/otolor-hero-bg.png';

const Services = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
    } = useQuery({
        queryKey: ['public', 'categories'],
        queryFn: getCategories,
    });

    const activeCategory = selectedCategory ?? categories[0]?._id ?? null;

    const {
        data: services = [],
        isLoading: isServicesLoading,
    } = useQuery({
        queryKey: ['public', 'services', activeCategory],
        queryFn: () => getServices(activeCategory || undefined),
        enabled: !!activeCategory,
    });

    useEffect(() => {
        if (!selectedCategory && categories.length > 0) {
            setSelectedCategory(categories[0]._id);
        }
    }, [categories, selectedCategory]);

    const filteredServices = useMemo(() => {
        if (!activeCategory) return [];
        return services;
    }, [services, activeCategory]);

    if (isCategoriesLoading) {
        return (
            <div
                className='w-full min-h-[80vh] overflow-hidden rounded-b-[100px] bg-cover bg-center bg-no-repeat pb-16'
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className='mx-auto w-full max-w-350 px-2.5 pt-7.5 md:px-4 md:pt-12.5'>
                    <div className='flex min-h-[70vh] items-center justify-center'>
                        <Spinner size='lg' />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className='w-full overflow-hidden bg-cover bg-center bg py-16 '
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            <div className='mx-auto w-full max-w-350 px-2.5 pt-7.5 md:px-4 md:pt-12.5'>
                <h1 className='mb-3 text-center text-[32px] font-bold tracking-[-0.5px] text-[#1D6652] md:text-5xl'>{t('servicesPage.title')}</h1>
                <p className='mb-8 text-center text-base font-medium text-gray-700 md:mb-12 md:text-lg'>
                    {t('servicesPage.subtitle')}
                </p>

                {/* Category Selection */}
                <div className='flex w-full flex-col gap-8 rounded-2xl border-2 border-white bg-white/12 p-4 backdrop-blur-[10px] md:gap-16 md:border-4 md:p-8'>
                    <div className='w-full'>
                        <h2 className='mb-4 text-center text-xl font-semibold text-[#0F3620] md:mb-6 md:text-2xl'>{t('servicesPage.categoryTitle')}</h2>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:gap-6'>
                            {categories.map((category) => (
                                <div
                                    key={category._id}
                                    className={`relative flex cursor-pointer flex-col items-center rounded-2xl border-[3px] p-3 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                        activeCategory === category._id
                                            ? 'border-[#1D6652] bg-linear-to-br from-[#0F3620]/5 to-white shadow-[0_8px_24px_rgba(29,102,82,0.2)]'
                                            : 'border-transparent bg-white hover:border-[#1D6652]/30'
                                    }`}
                                    onClick={() => setSelectedCategory(category._id)}
                                    role='button'
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(category._id)}
                                >
                                    {activeCategory === category._id && (
                                        <div className='absolute right-3 top-3 text-[#0F3620]'>
                                            <CheckCircle size={24} />
                                        </div>
                                    )}
                                    <h3 className='text-xl font-bold text-gray-800'>{category.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services Display */}
                    {activeCategory && (
                        <div className='w-full'>
                            <h2 className='mb-4 text-center text-xl font-semibold text-[#0F3620] md:mb-6 md:text-2xl'>
                                {categories.find(c => c._id === activeCategory)?.name} {t('servicesPage.servicesTitle')}
                            </h2>
                            <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
                                <div className='grid grid-cols-[1fr_120px] bg-linear-to-br from-[#1D6652] to-[#164C3E] text-sm font-semibold text-white md:grid-cols-[1fr_200px] md:text-base'>
                                    <div className='flex items-center p-4 text-sm md:p-5 md:text-base'>{t('servicesPage.tableName')}</div>
                                    <div className='flex items-center p-4 text-sm md:p-5 md:text-base'>{t('servicesPage.tablePrice')}</div>
                                </div>
                                <div className='max-h-150 overflow-y-auto'>
                                    {isServicesLoading && (
                                        <div className='flex items-center justify-center p-8'>
                                            <Spinner size='md' />
                                        </div>
                                    )}

                                    {!isServicesLoading && filteredServices.map((service) => (
                                        <div
                                            key={service._id}
                                            className='grid grid-cols-[1fr_120px] border-b border-gray-200 transition-colors duration-200 last:border-b-0 hover:bg-[#1D6652]/3 md:grid-cols-[1fr_200px]'
                                        >
                                            <div className='flex items-center p-3 text-sm font-medium text-gray-800 md:p-4 md:text-base'>{service.title}</div>
                                            <div className='flex items-center justify-end p-3 text-base font-bold text-[#1D6652] md:p-4 md:text-lg'>
                                                {typeof service.price === 'number' ? service.price.toLocaleString() : '—'} {t('servicesPage.currency')}
                                            </div>
                                        </div>
                                    ))}

                                    {!isServicesLoading && filteredServices.length === 0 && (
                                        <div className='px-6 py-10 text-center text-gray-600'>
                                            {t('servicesPage.emptyStateDesc')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!activeCategory && (
                        <div className='flex flex-col items-center justify-center px-5 py-16 text-center md:px-8 md:py-20'>
                            <div className='mb-6 text-[80px] opacity-80'>{t('servicesPage.emptyStateIcon')}</div>
                            <h3 className='mb-2 text-2xl font-bold text-gray-800'>{t('servicesPage.emptyStateTitle')}</h3>
                            <p className='max-w-100 text-base leading-[1.6] text-gray-600'>
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