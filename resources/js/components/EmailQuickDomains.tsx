import React from 'react';
import { EMAIL_DOMAIN_TEMPLATES, applyEmailDomain } from '@/lib/input-helpers';

interface EmailQuickDomainsProps {
    value: string;
    onSelect: (nextEmail: string) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    domains?: readonly string[];
    buttonClassName?: string;
}

export const EmailQuickDomains: React.FC<EmailQuickDomainsProps> = ({
    value,
    onSelect,
    inputRef,
    domains = EMAIL_DOMAIN_TEMPLATES,
    buttonClassName,
}) => {
    const handleDomainClick = (domain: string) => {
        const { nextValue, hasLocalPart } = applyEmailDomain(value, domain);
        onSelect(nextValue);

        if (inputRef?.current) {
            const el = inputRef.current;
            el.focus();
            if (!hasLocalPart) {
                requestAnimationFrame(() => {
                    el.setSelectionRange(0, 0);
                });
            }
        }
    };

    return (
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {domains.map((domain) => {
                const isActive = value.trim().toLowerCase().endsWith(domain);
                return (
                    <button
                        key={domain}
                        type="button"
                        onClick={() => handleDomainClick(domain)}
                        className={
                            buttonClassName ??
                            `cursor-pointer rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B54] ${
                                isActive
                                    ? 'border-[#16233B] bg-[#16233B] text-[#F2EBDC]'
                                    : 'border-[#D8CEBA] bg-[#FFFFFF] text-[#16233B] hover:border-[#A88B54] hover:bg-[#EAE1CE]/60'
                            }`
                        }
                    >
                        {domain}
                    </button>
                );
            })}
        </div>
    );
};
