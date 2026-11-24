import React, { useEffect, useRef, useState } from 'react';
import { m, useInView, useReducedMotion } from 'motion/react';
import { Search, MessageSquareHeart, CreditCard, Truck } from 'lucide-react';
import { fadeUp, viewportConfig } from '@/lib/motion';

export const HowToOrderSection: React.FC = () => {
    const stepperRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(stepperRef, { once: true, margin: '-80px' });
    const prefersReducedMotion = useReducedMotion();

    // 0: reset/empty, 1..3: step i completed & segment i filling, 4: all completed (5s pause)
    const [phase, setPhase] = useState<number>(prefersReducedMotion ? 4 : 0);

    useEffect(() => {
        if (prefersReducedMotion) {
            setPhase(4);
            return;
        }
        if (!isInView) return;

        let timer: ReturnType<typeof setTimeout>;

        if (phase === 0) {
            timer = setTimeout(() => setPhase(1), 400);
        } else if (phase >= 1 && phase <= 3) {
            timer = setTimeout(() => setPhase((prev) => prev + 1), 1150);
        } else {
            // Pause 5 seconds after all steps & pipes are filled, then reset to 0
            timer = setTimeout(() => setPhase(0), 5000);
        }

        return () => clearTimeout(timer);
    }, [phase, isInView, prefersReducedMotion]);

    const steps = [
        {
            number: '01',
            icon: Search,
            title: 'Pilih Koleksi',
            description:
                'Telusuri katalog hampers pilihan kami dan tentukan varian paket yang paling selaras dengan momen spesial Anda.',
        },
        {
            number: '02',
            icon: MessageSquareHeart,
            title: 'Konsultasi & Custom',
            description:
                'Diskusikan detail personalisasi, pilihan kartu ucapan kaligrafi, pita satin, hingga branding logo perusahaan Anda.',
        },
        {
            number: '03',
            icon: CreditCard,
            title: 'Konfirmasi & Pembayaran',
            description:
                'Setujui penawaran final atau invoice resmi, lalu lakukan pembayaran dengan berbagai opsi transfer bank terverifikasi.',
        },
        {
            number: '04',
            icon: Truck,
            title: 'Produksi & Pengiriman',
            description:
                'Tim kami merakit setiap kotak secara teliti dan mengirimkannya aman ke satu lokasi atau multi-alamat seluruh Indonesia.',
        },
    ];

    return (
        <section
            id="cara-pesan"
            aria-label="Cara Pemesanan"
            className="py-20 md:py-28 bg-[#FDFBF7] relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <m.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    variants={fadeUp}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#9A7D2E] font-semibold mb-3">
                        Alur Pemesanan
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1B382B] font-bold tracking-tight mb-4">
                        Langkah Mudah Menghadirkan Kebahagiaan
                    </h2>
                    <div className="w-12 h-0.5 bg-[#C8A951] mx-auto mb-5" />
                    <p className="text-[#6E675F] text-base">
                        Proses pemesanan yang terstruktur, transparan, dan terarah dari awal konsultasi hingga paket
                        sampai di tangan penerima.
                    </p>
                </m.div>

                <div ref={stepperRef}>
                    {/* Desktop Horizontal Connected Pipe Stepper */}
                    <div className="hidden lg:block relative">
                        {/* 3 Pipe Segments Connecting Centers of 4 Columns (12.5% to 87.5%) */}
                        <div
                            aria-hidden="true"
                            className="absolute top-10 left-[12.5%] right-[12.5%] -translate-y-1/2 grid grid-cols-3 z-0"
                        >
                            {[0, 1, 2].map((segIdx) => {
                                const isFlowingOrFilled = phase >= segIdx + 1;
                                return (
                                    <div
                                        key={segIdx}
                                        className="h-2.5 bg-[#E8E2D5] border-y border-[#DFD7C6] overflow-hidden relative"
                                    >
                                        <m.div
                                            initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                                            animate={{ scaleX: isFlowingOrFilled ? 1 : 0 }}
                                            transition={{
                                                duration: isFlowingOrFilled ? 1.0 : 0.25,
                                                ease: [0.37, 0, 0.63, 1],
                                            }}
                                            style={{ originX: 0 }}
                                            className="h-full w-full bg-gradient-to-r from-[#1B382B] via-[#264E3D] to-[#C8A951] will-change-transform"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* 4 Step Nodes + Text */}
                        <ol className="grid grid-cols-4 gap-8 relative z-10">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isCompleted = phase >= idx + 1;

                                return (
                                    <li key={step.number} className="flex flex-col items-center text-center">
                                        {/* Outer Ivory Mask Ring so the pipe connects seamlessly into the circle */}
                                        <div className="relative mb-6 p-1.5 rounded-full bg-[#FDFBF7]">
                                            <m.div
                                                animate={
                                                    isCompleted && !prefersReducedMotion
                                                        ? { scale: [1, 1.07, 1] }
                                                        : { scale: 1 }
                                                }
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className={`w-17 h-17 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'bg-[#1B382B] border-[#C8A951] text-[#DFCA86] shadow-[0_10px_25px_-6px_rgba(27,56,43,0.45)]'
                                                        : 'bg-[#F7F4EE] border-[#E8E2D5] text-[#9C9489]'
                                                }`}
                                            >
                                                <Icon className="w-7 h-7" />
                                            </m.div>

                                            <span
                                                className={`absolute top-0 right-0 w-7 h-7 rounded-full text-xs font-serif font-bold flex items-center justify-center border transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'bg-[#C8A951] text-[#0C1E17] border-[#FDFBF7]'
                                                        : 'bg-[#E8E2D5] text-[#6E675F] border-[#FDFBF7]'
                                                }`}
                                            >
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3
                                            className={`font-serif text-lg font-bold mb-2.5 transition-colors duration-300 ${
                                                isCompleted ? 'text-[#1B382B]' : 'text-[#6E675F]'
                                            }`}
                                        >
                                            {step.title}
                                        </h3>

                                        <p className="text-sm text-[#6E675F] leading-relaxed px-2">
                                            {step.description}
                                        </p>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    {/* Mobile & Tablet Vertical Connected Pipe Stepper */}
                    <ol className="lg:hidden flex flex-col max-w-xl mx-auto">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isCompleted = phase >= idx + 1;
                            const isPipeFilled = phase >= idx + 1;
                            const isLast = idx === steps.length - 1;

                            return (
                                <li key={step.number} className="flex items-stretch gap-5">
                                    {/* Left Column: Icon Circle + Vertical Flowing Pipe */}
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="relative z-10 p-1 rounded-full bg-[#FDFBF7]">
                                            <m.div
                                                animate={
                                                    isCompleted && !prefersReducedMotion
                                                        ? { scale: [1, 1.07, 1] }
                                                        : { scale: 1 }
                                                }
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'bg-[#1B382B] border-[#C8A951] text-[#DFCA86] shadow-[0_8px_20px_-6px_rgba(27,56,43,0.4)]'
                                                        : 'bg-[#F7F4EE] border-[#E8E2D5] text-[#9C9489]'
                                                }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </m.div>

                                            <span
                                                className={`absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full text-[11px] font-serif font-bold flex items-center justify-center border transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'bg-[#C8A951] text-[#0C1E17] border-[#FDFBF7]'
                                                        : 'bg-[#E8E2D5] text-[#6E675F] border-[#FDFBF7]'
                                                }`}
                                            >
                                                {step.number}
                                            </span>
                                        </div>

                                        {!isLast && (
                                            <div
                                                aria-hidden="true"
                                                className="w-2 flex-1 min-h-10 -my-1 bg-[#E8E2D5] border-x border-[#DFD7C6] overflow-hidden relative z-0"
                                            >
                                                <m.div
                                                    initial={{ scaleY: prefersReducedMotion ? 1 : 0 }}
                                                    animate={{ scaleY: isPipeFilled ? 1 : 0 }}
                                                    transition={{
                                                        duration: isPipeFilled ? 1.0 : 0.25,
                                                        ease: [0.37, 0, 0.63, 1],
                                                    }}
                                                    style={{ originY: 0 }}
                                                    className="w-full h-full bg-gradient-to-b from-[#1B382B] via-[#264E3D] to-[#C8A951] will-change-transform"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Step Title & Description */}
                                    <div className={isLast ? 'pt-2 pb-2' : 'pt-2 pb-10'}>
                                        <h3
                                            className={`font-serif text-lg font-bold mb-1.5 transition-colors duration-300 ${
                                                isCompleted ? 'text-[#1B382B]' : 'text-[#6E675F]'
                                            }`}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-[#6E675F] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
};
