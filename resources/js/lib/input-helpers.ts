export const MAX_PHONE_DIGITS = 12;

export const EMAIL_DOMAIN_TEMPLATES = [
    '@gmail.com',
    '@yahoo.com',
    '@yahoo.co.id',
    '@outlook.com',
    '@icloud.com',
] as const;

/**
 * Strip non-numeric characters and clamp phone number length to MAX_PHONE_DIGITS.
 */
export function sanitizePhoneInput(
    value: string,
    maxDigits: number = MAX_PHONE_DIGITS,
): string {
    return value.replace(/\D/g, '').slice(0, maxDigits);
}

/**
 * Apply or switch an email domain suffix while preserving the local-part username.
 */
export function applyEmailDomain(
    currentValue: string,
    domain: string,
): {
    nextValue: string;
    hasLocalPart: boolean;
} {
    const trimmed = currentValue.trim();
    const atIndex = trimmed.indexOf('@');
    const localPart = atIndex >= 0 ? trimmed.slice(0, atIndex) : trimmed;

    return {
        nextValue: `${localPart}${domain}`,
        hasLocalPart: localPart.length > 0,
    };
}
