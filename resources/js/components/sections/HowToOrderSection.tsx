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
                        Alur Pemesanan
                    </p>
                    <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#16233B] sm:text-4xl">
                        Langkah Mudah Menghadirkan Kebahagiaan
                    </h2>
                    <div className="mx-auto mb-5 h-0.5 w-12 bg-[#A88B54]" />
                    <p className="text-base text-[#6E675D]">
                        Proses pemesanan yang terstruktur, transparan, dan
                        terarah dari awal konsultasi hingga paket sampai di
                        tangan penerima.
                    </p>
                </m.div>

                <div ref={stepperRef}>
                    {/* Desktop Horizontal Connected Pipe Stepper */}
                    <div className="relative hidden lg:block">
                        {/* 3 Pipe Segments Connecting Centers of 4 Columns (12.5% to 87.5%) */}
                        <div
                            aria-hidden="true"
                            className="absolute top-10 right-[12.5%] left-[12.5%] z-0 grid -translate-y-1/2 grid-cols-3"
                        >
                            {[0, 1, 2].map((segIdx) => {
                                const isFlowingOrFilled = phase >= segIdx + 1;
                                return (
                                    <div
                                        key={segIdx}
                                        className="relative h-2.5 overflow-hidden border-y border-[#CFC4AE] bg-[#D8CEBA]"
                                    >
                                        <m.div
                                            initial={{
                                                scaleX: prefersReducedMotion
                                                    ? 1
                                                    : 0,
                                            }}
                                            animate={{
                                                scaleX: isFlowingOrFilled
                                                    ? 1
                                                    : 0,
                                            }}
                                            transition={{
                                                duration: isFlowingOrFilled
                                                    ? 1.0
                                                    : 0.25,
                                                ease: [0.37, 0, 0.63, 1],
                                            }}
                                            style={{ originX: 0 }}
                                            className="h-full w-full bg-gradient-to-r from-[#16233B] via-[#203252] to-[#A88B54] will-change-transform"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* 4 Step Nodes + Text */}
                        <ol className="relative z-10 grid grid-cols-4 gap-8">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isCompleted = phase >= idx + 1;

                                return (
                                    <li
                                        key={step.number}
                                        className="flex flex-col items-center text-center"
                                    >
                                        {/* Outer Ivory Mask Ring so the pipe connects seamlessly into the circle */}
                                        <div className="relative mb-6 rounded-full bg-[#F2EBDC] p-1.5">
                                            <m.div
                                                animate={
                                                    isCompleted &&
                                                    !prefersReducedMotion
                                                        ? {
                                                              scale: [
                                                                  1, 1.07, 1,
                                                              ],
                                                          }
                                                        : { scale: 1 }
                                                }
                                                transition={{
                                                    duration: 0.35,
                                                    ease: 'easeOut',
                                                }}
                                                className={`flex h-17 w-17 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'border-[#A88B54] bg-[#16233B] text-[#C5AA74] shadow-[0_10px_25px_-6px_rgba(22,35,59,0.45)]'
                                                        : 'border-[#D8CEBA] bg-[#EAE1CE] text-[#6E675D]'
                                                }`}
                                            >
                                                <Icon className="h-7 w-7" />
                                            </m.div>

                                            <span
                                                className={`absolute top-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border font-serif text-xs font-bold transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'border-[#F2EBDC] bg-[#A88B54] text-[#0B1322]'
                                                        : 'border-[#F2EBDC] bg-[#D8CEBA] text-[#6E675D]'
                                                }`}
                                            >
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3
                                            className={`mb-2.5 font-serif text-lg font-bold transition-colors duration-300 ${
                                                isCompleted
                                                    ? 'text-[#16233B]'
                                                    : 'text-[#6E675D]'
                                            }`}
                                        >
                                            {step.title}
                                        </h3>

                                        <p className="px-2 text-sm leading-relaxed text-[#6E675D]">
                                            {step.description}
                                        </p>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    {/* Mobile & Tablet Vertical Connected Pipe Stepper */}
                    <ol className="mx-auto flex max-w-xl flex-col lg:hidden">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isCompleted = phase >= idx + 1;
                            const isPipeFilled = phase >= idx + 1;
                            const isLast = idx === steps.length - 1;

                            return (
                                <li
                                    key={step.number}
                                    className="flex items-stretch gap-5"
                                >
                                    {/* Left Column: Icon Circle + Vertical Flowing Pipe */}
                                    <div className="flex shrink-0 flex-col items-center">
                                        <div className="relative z-10 rounded-full bg-[#F2EBDC] p-1">
                                            <m.div
                                                animate={
                                                    isCompleted &&
                                                    !prefersReducedMotion
                                                        ? {
                                                              scale: [
                                                                  1, 1.07, 1,
                                                              ],
                                                          }
                                                        : { scale: 1 }
                                                }
                                                transition={{
                                                    duration: 0.35,
                                                    ease: 'easeOut',
                                                }}
                                                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'border-[#A88B54] bg-[#16233B] text-[#C5AA74] shadow-[0_8px_20px_-6px_rgba(22,35,59,0.4)]'
                                                        : 'border-[#D8CEBA] bg-[#EAE1CE] text-[#6E675D]'
                                                }`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </m.div>

                                            <span
                                                className={`absolute -top-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border font-serif text-[11px] font-bold transition-colors duration-300 ${
                                                    isCompleted
                                                        ? 'border-[#F2EBDC] bg-[#A88B54] text-[#0B1322]'
                                                        : 'border-[#F2EBDC] bg-[#D8CEBA] text-[#6E675D]'
                                                }`}
                                            >
                                                {step.number}
                                            </span>
                                        </div>

                                        {!isLast && (
                                            <div
                                                aria-hidden="true"
                                                className="relative z-0 -my-1 min-h-10 w-2 flex-1 overflow-hidden border-x border-[#CFC4AE] bg-[#D8CEBA]"
                                            >
                                                <m.div
                                                    initial={{
                                                        scaleY: prefersReducedMotion
                                                            ? 1
                                                            : 0,
                                                    }}
                                                    animate={{
                                                        scaleY: isPipeFilled
                                                            ? 1
                                                            : 0,
                                                    }}
                                                    transition={{
                                                        duration: isPipeFilled
                                                            ? 1.0
                                                            : 0.25,
                                                        ease: [
                                                            0.37, 0, 0.63, 1,
                                                        ],
                                                    }}
                                                    style={{ originY: 0 }}
                                                    className="h-full w-full bg-gradient-to-b from-[#16233B] via-[#203252] to-[#A88B54] will-change-transform"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Step Title & Description */}
                                    <div
                                        className={
                                            isLast ? 'pt-2 pb-2' : 'pt-2 pb-10'
                                        }
                                    >
                                        <h3
                                            className={`mb-1.5 font-serif text-lg font-bold transition-colors duration-300 ${
                                                isCompleted
                                                    ? 'text-[#16233B]'
                                                    : 'text-[#6E675D]'
                                            }`}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#6E675D]">
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
