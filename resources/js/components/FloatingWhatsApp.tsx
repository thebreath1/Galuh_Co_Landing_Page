import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

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
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="hidden sm:flex items-center px-3.5 py-2 rounded-full bg-[#1B382B] text-[#FDFBF7] text-xs font-medium tracking-wide shadow-xl border border-[#C8A951]/30"
                    >
                        <span>Konsultasi Hampers</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi GALUH & CO. via WhatsApp"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#1B382B] text-[#FDFBF7] shadow-2xl border-2 border-[#C8A951] group focus:outline-none focus:ring-4 focus:ring-[#C8A951]/40"
            >
                {/* Subtle pulsing background ring */}
                <span className="absolute -inset-1 rounded-full bg-[#C8A951]/25 animate-ping pointer-events-none" />

                <MessageCircle className="w-6 h-6 text-[#DFCA86] group-hover:rotate-12 transition-transform duration-300" />
            </motion.a>
        </aside>
    );
};
