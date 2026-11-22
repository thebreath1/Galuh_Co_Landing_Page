import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { fadeUp, viewportConfig } from '@/lib/motion';

interface Testimonial {
    initials: string;
    name: string;
    role: string;
    content: string;
    productTag: string;
    rating: number;
}

export const TestimonialsSection: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            initials: 'DS',
            name: 'Dian Sastrawati',
            role: 'VP Human Capital, PT Astra Financial',
            content:
                'Kerapian kemasan dan kelezatan kue kering dari GALUH & CO. mendapat apresiasi langsung dari jajaran direksi kami. Pengiriman multi-alamat ke 300 rekan bisnis di 5 kota besar terlaksana tepat waktu tanpa cacat.',
            productTag: 'Synergy Grand Hamper • Corporate Order',
            rating: 5,
        },
        {
            initials: 'HG',
            name: 'Hendra Gunawan',
            role: 'Managing Partner, HG Law Firm',
            content:
                'Hampers akhir tahun untuk para klien VVIP kami dipersiapkan dengan sangat eksklusif. Grafir logo emas di atas hardbox magnetik beludru membuat bingkisan ini terasa berbobot, elegan, dan penuh rasa hormat.',
            productTag: 'Executive Prestige Gift • VIP Custom',
            rating: 5,
        },
        {
            initials: 'NF',
            name: 'Nadira & Fikri',
            role: 'Bridal Couple, Jakarta Selatan',
            content:
                'Souvenir dan hampers pengiring pengantin kami luar biasa anggun. Detail pita satin sutra dan stempel lilin monogram inisial nama kami membuat sahabat-sahabat terharu saat menerima undangannya.',
            productTag: 'Eternal Grace Bridal Suite • Wedding',
            rating: 5,
        },
        {
            initials: 'KC',
            name: 'Kartika Chandra',
            role: 'Private Client, Surabaya',
            content:
                'Sudah 3 tahun berturut-turut saya mempercayakan hampers Idul Fitri kepada GALUH & CO. Rasa nastar wisman dan kastengelnya benar-benar resep asli mentega Belanda. Selalu jadi rebutan keluarga!',
            productTag: 'The Royal Fitr • Personal Order',
            rating: 5,
        },
    ];

    const [isDesktop, setIsDesktop] = useState<boolean>(() =>
        typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
    );
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDesktop(e.matches);
            setCurrentSlide(0);
        };
        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const itemsPerSlide = isDesktop ? 2 : 1;
    const slides: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
        slides.push(testimonials.slice(i, i + itemsPerSlide));
    }

    const safeSlideIndex = Math.min(currentSlide, slides.length - 1);

    const prevSlide = () => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev <= 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -50) {
            nextSlide();
        } else if (info.offset.x > 50) {
            prevSlide();
        }
    };

    return (
        <section
            id="testimoni"
            aria-label="Testimoni Pelanggan"
            className="py-20 md:py-28 bg-[#FDFBF7] relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#9A7D2E] font-semibold mb-3">
                        Testimoni Klien
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Cerita Hangat dari Mereka yang Telah Berbagi
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        Kepuasan dan senyum penerima adalah tolak ukur dedikasi kami dalam merangkai setiap hantaran.
                    </p>
                </motion.div>

                {/* Draggable Two-Card Carousel */}
                <div className="max-w-5xl mx-auto relative">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${itemsPerSlide}-${safeSlideIndex}`}
                            initial={{ opacity: 0, x: direction >= 0 ? 30 : -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction >= 0 ? -30 : 30 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 cursor-grab active:cursor-grabbing"
                        >
                            {slides[safeSlideIndex].map((item, idx) => (
                                <article
                                    key={idx}
                                    className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] shadow-luxury hover:shadow-luxury-hover transition-shadow flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Card Header: Avatar + Name | Role */}
                                    <div className="px-6 py-4 bg-[#FDFBF7] border-b border-[#E8E2D5] flex items-center gap-3.5">
                                        <div
                                            aria-hidden="true"
                                            className="w-11 h-11 rounded-full bg-[#F7F2E4] border border-[#C8A951]/40 text-[#1B382B] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0"
                                        >
                                            {item.initials}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 min-w-0 flex-1">
                                            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1B382B] sm:truncate">
                                                {item.name}
                                            </h3>
                                            <span
                                                aria-hidden="true"
                                                className="hidden sm:block w-px h-6 bg-[#E8E2D5] flex-shrink-0"
                                            />
                                            <p className="text-xs text-[#6E675F] leading-snug line-clamp-2">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Body: Stars + Quote */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div
                                            className="flex items-center gap-1 text-[#C8A951] mb-4"
                                            aria-label={`Rating ${item.rating} dari 5 bintang`}
                                        >
                                            {[...Array(item.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>

                                        <blockquote className="text-sm sm:text-base text-[#2C2724] leading-relaxed text-left">
                                            &ldquo;{item.content}&rdquo;
                                        </blockquote>
                                    </div>

                                    {/* Card Bottom Strip: Order Context */}
                                    <div className="px-6 py-3 bg-[#F7F4EE]/70 border-t border-[#E8E2D5]/80 flex items-center gap-2 text-xs text-[#6E675F]">
                                        <Sparkles className="w-3.5 h-3.5 text-[#C8A951] flex-shrink-0" />
                                        <span className="font-medium text-[#1B382B]/80 truncate">
                                            {item.productTag}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons & Dots */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="w-11 h-11 rounded-full border border-[#E8E2D5] bg-[#FFFFFF] text-[#1B382B] hover:bg-[#1B382B] hover:text-[#DFCA86] hover:border-[#1B382B] transition-colors flex items-center justify-center shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                            aria-label="Ulasan sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setDirection(idx > currentSlide ? 1 : -1);
                                        setCurrentSlide(idx);
                                    }}
                                    className={`w-2.5 h-2.5 rounded-full transition-transform transition-colors duration-200 ${
                                        safeSlideIndex === idx ? 'bg-[#1B382B] scale-125' : 'bg-[#E8E2D5] hover:bg-[#C8A951]/60'
                                    }`}
                                    aria-label={`Beralih ke halaman ulasan ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={nextSlide}
                            className="w-11 h-11 rounded-full border border-[#E8E2D5] bg-[#FFFFFF] text-[#1B382B] hover:bg-[#1B382B] hover:text-[#DFCA86] hover:border-[#1B382B] transition-colors flex items-center justify-center shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                            aria-label="Ulasan berikutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
