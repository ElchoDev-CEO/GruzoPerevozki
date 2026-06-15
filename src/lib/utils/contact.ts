const stripSpaces = (phone: string): string => phone.replace(/\s+/g, '');
const digitsAndPlus = (phone: string): string => phone.replace(/[^\d+]/g, '');
const digitsOnly = (phone: string): string => phone.replace(/\D/g, '');

export const telHref = (phone: string): string => `tel:${digitsAndPlus(stripSpaces(phone))}`;

export const waHref = (phone: string): string => `https://wa.me/${digitsOnly(phone)}`;
