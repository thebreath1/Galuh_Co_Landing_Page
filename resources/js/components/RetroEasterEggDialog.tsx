import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';

export interface RetroEasterEggContent {
    title: string;
    lines: string[];
    avatarSrc?: string;
}

interface RetroEasterEggDialogProps {
    content: RetroEasterEggContent | null;
    onClose: () => void;
}

/**
 * Pixel-art character portrait placeholder modeled after classic 16-bit RPG dialog boxes.
 * Easily swappable with an actual sprite/image via `avatarSrc`.
 */
const PixelCharacterPlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#0B0D14] border-2 border-[#161925] shadow-[inset_0_0_0_2px_#7E84A3,0_2px_0_#161925] flex flex-col items-center justify-center relative overflow-hidden select-none">
        <svg
            viewBox="0 0 16 16"
            className="w-14 h-14 sm:w-16 sm:h-16"
            shapeRendering="crispEdges"
            aria-hidden="true"
        >
            {/* Hat / Top */}
            <rect x="4" y="1" width="8" height="2" fill="#9A8F4A" />
            <rect x="3" y="3" width="10" height="1" fill="#6F6732" />
            {/* Face / Head */}
            <rect x="4" y="4" width="8" height="6" fill="#B5AB5B" />
            <rect x="3" y="5" width="1" height="4" fill="#7D763A" />
            <rect x="12" y="5" width="1" height="4" fill="#524D25" />
            {/* Eyes */}
            <rect x="5" y="6" width="2" height="2" fill="#0B0D14" />
            <rect x="9" y="6" width="2" height="2" fill="#0B0D14" />
            <rect x="5" y="6" width="1" height="1" fill="#F8FAFC" />
            <rect x="9" y="6" width="1" height="1" fill="#F8FAFC" />
            {/* Mustache / Collar */}
            <rect x="4" y="9" width="8" height="2" fill="#6E7B2C" />
            <rect x="5" y="10" width="6" height="1" fill="#464E1A" />
            {/* Shoulders / Coat */}
            <rect x="3" y="11" width="10" height="4" fill="#1B382B" />
            <rect x="6" y="11" width="4" height="4" fill="#C8A951" />
            <rect x="7" y="11" width="2" height="4" fill="#DFCA86" />
        </svg>
        <span
            title={`Placeholder karakter untuk ${title}`}
            className="absolute bottom-0.5 inset-x-0 text-center font-mono text-[8px] font-bold tracking-widest text-[#9BA1BC]/85 uppercase leading-none"
        >
            CHAR SLOT
        </span>
    </div>
);

export const RetroEasterEggDialog: React.FC<RetroEasterEggDialogProps> = ({ content, onClose }) => {
    const prefersReducedMotion = useReducedMotion();
    const okButtonRef = useRef<HTMLButtonElement>(null);
    const fullText = content ? content.lines.join('\n') : '';
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        if (!content) {
            setVisibleCount(0);
            return;
        }

        if (prefersReducedMotion) {
            setVisibleCount(fullText.length);
            return;
        }

        setVisibleCount(0);
        const timer = window.setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= fullText.length) {
                    window.clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 20);

        return () => window.clearInterval(timer);
    }, [content, fullText, prefersReducedMotion]);

    useEffect(() => {
        if (!content) return;

        const focusTimer = window.setTimeout(() => {
            okButtonRef.current?.focus();
        }, 50);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [content, onClose]);

    const isTyping = visibleCount < fullText.length;

    const handleBoxClick = () => {
        if (isTyping) {
            setVisibleCount(fullText.length);
        }
    };

    return (
        <AnimatePresence>
            {content && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-[#090A0F]/65 backdrop-blur-[2px]"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Secret dialog: ${content.title}`}
                >
                    <m.div
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBoxClick();
                        }}
                        className="w-full max-w-2xl bg-[#434668] border-4 border-[#090A0F] shadow-[inset_0_4px_0_#A6ACC6,inset_0_-4px_0_#272941,inset_4px_0_0_#7F85A3,inset_-4px_0_0_#272941,0_16px_44px_rgba(0,0,0,0.6)] p-5 sm:p-7 select-none"
                    >
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                            {/* Character Portrait Slot (Placeholder) */}
                            {content.avatarSrc ? (
                                <img
                                    src={content.avatarSrc}
                                    alt={content.title}
                                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 object-cover border-2 border-[#161925] shadow-[inset_0_0_0_2px_#7E84A3]"
                                />
                            ) : (
                                <PixelCharacterPlaceholder title={content.title} />
                            )}

                            {/* Dialog Text & OK Button */}
                            <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                                <p className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider leading-relaxed text-[#F8FAFC] whitespace-pre-line [text-shadow:2px_2px_0_#090A0F] min-h-[5.5rem]">
                                    {fullText.slice(0, visibleCount)}
                                    {isTyping && (
                                        <span className="inline-block w-2 h-4 ml-1 align-middle bg-[#F8FAFC] animate-pulse" />
                                    )}
                                </p>

                                <div className="mt-5 pt-1">
                                    <button
                                        ref={okButtonRef}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onClose();
                                        }}
                                        className="group inline-flex items-center gap-2.5 font-mono text-sm sm:text-base font-bold uppercase tracking-widest text-[#F8FAFC] hover:text-[#DFCA86] focus:outline-none focus-visible:text-[#DFCA86] [text-shadow:2px_2px_0_#090A0F] cursor-pointer transition-colors"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="inline-block w-2.5 h-2.5 bg-[#F8FAFC] group-hover:bg-[#DFCA86] group-focus-visible:bg-[#DFCA86] shadow-[2px_2px_0_#090A0F]"
                                        />
                                        <span>OK</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>
    );
};
