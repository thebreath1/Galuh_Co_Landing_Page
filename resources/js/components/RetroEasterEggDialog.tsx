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
    <div className="relative flex h-20 w-20 shrink-0 flex-col items-center justify-center overflow-hidden border-2 border-[#161925] bg-[#0B0D14] shadow-[inset_0_0_0_2px_#7E84A3,0_2px_0_#161925] select-none sm:h-24 sm:w-24">
        <svg
            viewBox="0 0 16 16"
            className="h-14 w-14 sm:h-16 sm:w-16"
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
            <rect x="3" y="11" width="10" height="4" fill="#16233B" />
            <rect x="6" y="11" width="4" height="4" fill="#A88B54" />
            <rect x="7" y="11" width="2" height="4" fill="#C5AA74" />
        </svg>
        <span
            title={`Placeholder karakter untuk ${title}`}
            className="absolute inset-x-0 bottom-0.5 text-center font-mono text-[8px] leading-none font-bold tracking-widest text-[#9BA1BC]/85 uppercase"
        >
            CHAR SLOT
        </span>
    </div>
);

export const RetroEasterEggDialog: React.FC<RetroEasterEggDialogProps> = ({
    content,
    onClose,
}) => {
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
                    className="fixed inset-0 z-50 flex items-end justify-center bg-[#090A0F]/65 p-4 backdrop-blur-[2px] sm:items-center sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Secret dialog: ${content.title}`}
                >
                    <m.div
                        initial={
                            prefersReducedMotion
                                ? { opacity: 1 }
                                : { opacity: 0, y: 18, scale: 0.96 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 12, scale: 0.97 }
                        }
                        transition={{
                            duration: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBoxClick();
                        }}
                        className="w-full max-w-2xl border-4 border-[#090A0F] bg-[#434668] p-5 shadow-[inset_0_4px_0_#A6ACC6,inset_0_-4px_0_#272941,inset_4px_0_0_#7F85A3,inset_-4px_0_0_#272941,0_16px_44px_rgba(0,0,0,0.6)] select-none sm:p-7"
                    >
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
                            {/* Character Portrait Slot (Placeholder) */}
                            {content.avatarSrc ? (
                                <img
                                    src={content.avatarSrc}
                                    alt={content.title}
                                    className="h-20 w-20 shrink-0 border-2 border-[#161925] object-cover shadow-[inset_0_0_0_2px_#7E84A3] sm:h-24 sm:w-24"
                                />
                            ) : (
                                <PixelCharacterPlaceholder
                                    title={content.title}
                                />
                            )}

                            {/* Dialog Text & OK Button */}
                            <div className="flex w-full min-w-0 flex-1 flex-col justify-between">
                                <p className="min-h-[5.5rem] font-mono text-sm leading-relaxed font-bold tracking-wider whitespace-pre-line text-[#F8FAFC] uppercase [text-shadow:2px_2px_0_#090A0F] sm:text-base">
                                    {fullText.slice(0, visibleCount)}
                                    {isTyping && (
                                        <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-[#F8FAFC] align-middle" />
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
                                        className="group inline-flex cursor-pointer items-center gap-2.5 font-mono text-sm font-bold tracking-widest text-[#F8FAFC] uppercase transition-colors [text-shadow:2px_2px_0_#090A0F] hover:text-[#C5AA74] focus:outline-none focus-visible:text-[#C5AA74] sm:text-base"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="inline-block h-2.5 w-2.5 bg-[#F8FAFC] shadow-[2px_2px_0_#090A0F] group-hover:bg-[#C5AA74] group-focus-visible:bg-[#C5AA74]"
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
