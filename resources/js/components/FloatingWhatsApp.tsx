import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

interface FloatingWhatsAppProps {
    whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin berkonsultasi mengenai pemesanan hampers eksklusif.'
    )}`;

    return (
        <aside
            aria-label="Kontak Cepat WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <m.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs font-medium tracking-wide shadow-xl border border-[#C8A951]/30 select-none"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                        <span>Chat via WhatsApp</span>
                    </m.div>
                )}
            </AnimatePresence>

            <m.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi GALUH & CO. via WhatsApp"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] border border-[#20BD5A] group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 transition-transform transition-colors duration-300"
            >
                <WhatsAppIcon className="w-7 h-7 text-white drop-shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
            </m.a>
        </aside>
    );
};
