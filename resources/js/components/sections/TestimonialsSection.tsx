import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { fadeUp, viewportConfig } from '@/lib/motion';

export const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            name: 'Dian Sastrawati',
            role: 'VP Human Capital, PT Astra Financial',
            content:
                'Kerapian kemasan dan kelezatan kue kering dari GALUH & CO. mendapat apresiasi langsung dari jajaran direksi kami. Pengiriman multi-alamat ke 300 rekan bisnis di 5 kota besar terlaksana tepat waktu tanpa cacat.',
            rating: 5,
        },
        {
            name: 'Hendra Gunawan',
            role: 'Managing Partner, HG Law Firm',
            content:
                'Hampers akhir tahun untuk para klien VVIP kami dipersiapkan dengan sangat eksklusif. Grafir logo emas di atas hardbox magnetik beludru membuat bingkisan ini terasa berbobot, elegan, dan penuh rasa hormat.',
            rating: 5,
        },
        {
            name: 'Nadira & Fikri',
            role: 'Bridal Couple, Jakarta Selatan',
            content:
                'Souvenir dan hampers pengiring pengantin kami luar biasa anggun. Detail pita satin sutra dan stempel lilin monogram inisial nama kami membuat sahabat-sahabat terharu saat menerima undangannya.',
            rating: 5,
        },
        {
            name: 'Kartika Chandra',
            role: 'Private Client, Surabaya',
            content:
                'Sudah 3 tahun berturut-turut saya mempercayakan hampers Idul Fitri kepada GALUH & CO. Rasa nastar wisman dan kastengelnya benar-benar resep asli mentega Belanda. Selalu jadi rebutan keluarga!',
            rating: 5,
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
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
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C8A951] font-semibold mb-3">
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

                {/* Testimonial Showcase */}
                <div className="max-w-4xl mx-auto relative px-4 sm:px-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35 }}
                            className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-12 border border-[#E8E2D5] shadow-luxury relative text-center"
                        >
                            {/* Decorative Quote Icon */}
                            <div className="w-12 h-12 rounded-full bg-[#F7F2E4] text-[#C8A951] flex items-center justify-center mx-auto mb-6">
                                <Quote className="w-6 h-6 rotate-180" />
                            </div>

                            {/* Stars */}
                            <div className="flex items-center justify-center gap-1.5 text-[#C8A951] mb-6">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>

                            {/* Quote Text */}
                            <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-[#1B382B] leading-relaxed mb-8 italic">
                                &ldquo;{testimonials[currentIndex].content}&rdquo;
                            </blockquote>

                            {/* Author */}
                            <div>
                                <p className="font-serif text-base sm:text-lg font-bold text-[#1B382B]">
                                    {testimonials[currentIndex].name}
                                </p>
                                <p className="text-xs sm:text-sm text-[#C8A951] font-medium tracking-wide mt-1">
                                    {testimonials[currentIndex].role}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="w-11 h-11 rounded-full border border-[#E8E2D5] bg-[#FFFFFF] text-[#1B382B] hover:bg-[#1B382B] hover:text-[#DFCA86] hover:border-[#1B382B] transition-colors flex items-center justify-center shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                            aria-label="Ulasan sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Indicator Dots */}
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-2 rounded-full transition-all ${
                                        currentIndex === idx ? 'w-6 bg-[#1B382B]' : 'w-2 bg-[#E8E2D5]'
                                    }`}
                                    aria-label={`Beralih ke ulasan ${idx + 1}`}
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
