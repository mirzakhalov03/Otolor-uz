import { type CategoryInfo, type Service } from '../types/service.types';

export const categories: CategoryInfo[] = [
    {
        id: 'ear',
        title: 'Quloq',
        icon: '👂',
        description: 'Quloq kasalliklari va muolajasi'
    },
    {
        id: 'nose',
        title: 'Burun',
        icon: '👃',
        description: 'Burun kasalliklari va muolajasi'
    },
    {
        id: 'throat',
        title: 'Tomoq',
        icon: '🗣️',
        description: 'Tomoq kasalliklari va muolajasi'
    },
    {
        id: 'larynx',
        title: 'Halqum',
        icon: '🫁',
        description: 'Halqum kasalliklari va muolajasi'
    }
];

export const services: Service[] = [
    // Ear Services
    { id: 1, name: 'Quloq ko\'rigi', price: '150,000', category: 'ear' },
    { id: 2, name: 'Audiometriya', price: '200,000', category: 'ear' },
    { id: 3, name: 'Timpanometriya', price: '180,000', category: 'ear' },
    { id: 4, name: 'Quloq yuvish', price: '100,000', category: 'ear' },
    { id: 5, name: 'Quloq shilliq pardasi tekshiruvi', price: '250,000', category: 'ear' },
    { id: 6, name: 'Quloq tiqini olib tashlash', price: '120,000', category: 'ear' },
    { id: 7, name: 'Otoskopiya', price: '130,000', category: 'ear' },
    { id: 8, name: 'Quloq yallig\'lanishini davolash', price: '300,000', category: 'ear' },

    // Nose Services
    { id: 9, name: 'Burun ko\'rigi', price: '150,000', category: 'nose' },
    { id: 10, name: 'Rinoskopiya', price: '180,000', category: 'nose' },
    { id: 11, name: 'Burun septumini tekshirish', price: '220,000', category: 'nose' },
    { id: 12, name: 'Burun poliplari davolash', price: '350,000', category: 'nose' },
    { id: 13, name: 'Sinusit davolash', price: '280,000', category: 'nose' },
    { id: 14, name: 'Burun qon ketishini to\'xtatish', price: '200,000', category: 'nose' },
    { id: 15, name: 'Allergik rinit davolash', price: '250,000', category: 'nose' },
    { id: 16, name: 'Burun bo\'shlig\'ini yuvish', price: '100,000', category: 'nose' },

    // Throat Services
    { id: 17, name: 'Tomoq ko\'rigi', price: '150,000', category: 'throat' },
    { id: 18, name: 'Faringoskopiya', price: '170,000', category: 'throat' },
    { id: 19, name: 'Tonzillit davolash', price: '280,000', category: 'throat' },
    { id: 20, name: 'Faringit davolash', price: '250,000', category: 'throat' },
    { id: 21, name: 'Bodomcha olib tashlash (konsultatsiya)', price: '200,000', category: 'throat' },
    { id: 22, name: 'Tomoq yallig\'lanishini davolash', price: '300,000', category: 'throat' },
    { id: 23, name: 'Tomoq og\'rig\'ini davolash', price: '220,000', category: 'throat' },
    { id: 24, name: 'Tomoqni yumshatish muolajasi', price: '180,000', category: 'throat' },

    // Larynx Services
    { id: 25, name: 'Halqum ko\'rigi', price: '200,000', category: 'larynx' },
    { id: 26, name: 'Laringoskopiya', price: '280,000', category: 'larynx' },
    { id: 27, name: 'Ovoz yo\'qolishi davolash', price: '350,000', category: 'larynx' },
    { id: 28, name: 'Laringit davolash', price: '300,000', category: 'larynx' },
    { id: 29, name: 'Ovoz paychalarini tekshirish', price: '320,000', category: 'larynx' },
    { id: 30, name: 'Halqum yallig\'lanishini davolash', price: '280,000', category: 'larynx' },
    { id: 31, name: 'Ovoz terapiyasi', price: '400,000', category: 'larynx' },
    { id: 32, name: 'Halqum poliplari tekshiruvi', price: '350,000', category: 'larynx' }
];
