import React, { useEffect, useState } from 'react';
import { m, AnimatePresence, type PanInfo } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { fadeUp, viewportConfig } from '@/lib/motion';
import type { SiteSettings, TestimonialRecord } from '@/types/landing';

interface TestimonialItem {
    id?: number;
    initials: string;
    name: string;
    role: string;
    content: string;
    productTag: string;
    rating: number;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
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

interface TestimonialsSectionProps {
    testimonials?: TestimonialRecord[];
    settings?: SiteSettings;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
    testimonials: remoteTestimonials,
    settings,
}) => {
    const items: TestimonialItem[] =
        remoteTestimonials !== undefined
            ? remoteTestimonials.map((item) => ({
                  id: item.id,
                  initials: item.initials,
                  name: item.name,
                  role: item.role,
                  content: item.content,
                  productTag: item.product_tag,
                  rating: Math.max(1, Math.min(5, item.rating || 5)),
              }))
            : DEFAULT_TESTIMONIALS;

    const eyebrow = settings?.testimonials_eyebrow || 'Testimoni Klien';
    const title =
        settings?.testimonials_title ||
        'Cerita Hangat dari Mereka yang Telah Berbagi';
    const description =
        settings?.testimonials_description ||
        'Kepuasan dan senyum penerima adalah tolak ukur dedikasi kami dalam merangkai setiap hantaran.';

    const [isDesktop, setIsDesktop] = useState<boolean>(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(min-width: 768px)').matches
            : false,
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
    const slides: TestimonialItem[][] = [];
    for (let i = 0; i < items.length; i += itemsPerSlide) {
        slides.push(items.slice(i, i + itemsPerSlide));
    }

    if (slides.length === 0) {
        return null;
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

    const handleDragEnd = (
        _event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => {
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
            className="relative overflow-hidden bg-[#F2EBDC] py-20 md:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <m.div
                    className="mx-auto mb-16 max-w-2xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#725C30] uppercase">
                        {eyebrow}
                    </p>
                    <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#16233B] sm:text-4xl">
                        {title}
                    </h2>
                    <div className="mx-auto mb-5 h-0.5 w-12 bg-[#A88B54]" />
                    <p className="text-base text-[#6E675D]">{description}</p>
                </m.div>

                {/* Draggable Two-Card Carousel */}
                <div className="relative mx-auto max-w-5xl">
                    <AnimatePresence mode="wait" initial={false}>
                        <m.div
                            key={`${itemsPerSlide}-${safeSlideIndex}`}
                            initial={{
                                opacity: 0,
                                x: direction >= 0 ? 30 : -30,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction >= 0 ? -30 : 30 }}
                            transition={{
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className="grid cursor-grab grid-cols-1 gap-6 active:cursor-grabbing md:grid-cols-2 lg:gap-8"
                        >
                            {slides[safeSlideIndex].map((item, idx) => (
                                <article
                                    key={idx}
                                    className="shadow-luxury hover:shadow-luxury-hover flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D8CEBA] bg-[#FFFFFF] transition-shadow"
                                >
                                    {/* Card Header: Avatar + Name | Role */}
                                    <div className="flex items-center gap-3.5 border-b border-[#D8CEBA] bg-[#F2EBDC] px-6 py-4">
                                        <div
                                            aria-hidden="true"
                                            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#A88B54]/40 bg-[#EFE6D2] font-serif text-sm font-bold text-[#16233B]"
                                        >
                                            {item.initials}
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                                            <h3 className="font-serif text-base font-bold text-[#16233B] sm:truncate sm:text-lg">
                                                {item.name}
                                            </h3>
                                            <span
                                                aria-hidden="true"
                                                className="hidden h-6 w-px flex-shrink-0 bg-[#D8CEBA] sm:block"
                                            />
                                            <p className="line-clamp-2 text-xs leading-snug text-[#6E675D]">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Body: Stars + Quote */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div
                                            className="mb-4 flex items-center gap-1 text-[#A88B54]"
                                            aria-label={`Rating ${item.rating} dari 5 bintang`}
                                        >
                                            {[...Array(item.rating)].map(
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-4 w-4 fill-current"
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <blockquote className="text-left text-sm leading-relaxed text-[#1E2430] sm:text-base">
                                            &ldquo;{item.content}&rdquo;
                                        </blockquote>
                                    </div>

                                    {/* Card Bottom Strip: Order Context */}
                                    <div className="flex items-center gap-2 border-t border-[#D8CEBA]/80 bg-[#EAE1CE]/70 px-6 py-3 text-xs text-[#6E675D]">
                                        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-[#A88B54]" />
                                        <span className="truncate font-medium text-[#16233B]/80">
                                            {item.productTag}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </m.div>
                    </AnimatePresence>

                    {/* Navigation Buttons & Dots */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CEBA] bg-[#FFFFFF] text-[#16233B] shadow-xs transition-colors hover:border-[#16233B] hover:bg-[#16233B] hover:text-[#C5AA74] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                            aria-label="Ulasan sebelumnya"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setDirection(
                                            idx > currentSlide ? 1 : -1,
                                        );
                                        setCurrentSlide(idx);
                                    }}
                                    className={`h-2.5 w-2.5 rounded-full transition-colors transition-transform duration-200 ${
                                        safeSlideIndex === idx
                                            ? 'scale-125 bg-[#16233B]'
                                            : 'bg-[#D8CEBA] hover:bg-[#A88B54]/60'
                                    }`}
                                    aria-label={`Beralih ke halaman ulasan ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={nextSlide}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CEBA] bg-[#FFFFFF] text-[#16233B] shadow-xs transition-colors hover:border-[#16233B] hover:bg-[#16233B] hover:text-[#C5AA74] focus:ring-2 focus:ring-[#A88B54] focus:outline-none"
                            aria-label="Ulasan berikutnya"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
