import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

interface FloatingWhatsAppProps {
    whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
    whatsappNumber,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const cleanedNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin berkonsultasi mengenai pemesanan hampers eksklusif.',
    )}`;

    return (
        <aside
            aria-label="Kontak Cepat WhatsApp"
            className="fixed right-6 bottom-6 z-50 flex items-center gap-3"
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
                        className="hidden items-center gap-2 rounded-full border border-[#A88B54]/30 bg-[#16233B] px-3.5 py-2 text-xs font-medium tracking-wide text-[#F2EBDC] shadow-xl select-none sm:flex"
                    >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#25D366]" />
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
                className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[#20BD5A] bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-colors transition-transform duration-300 hover:bg-[#20BD5A] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] focus:ring-4 focus:ring-[#25D366]/40 focus:outline-none"
            >
                <WhatsAppIcon className="h-7 w-7 text-white drop-shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </m.a>
        </aside>
    );
};
