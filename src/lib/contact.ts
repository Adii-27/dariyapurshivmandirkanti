export const TEMPLE_EMAIL = "dariyapurshivmandirkanti@gmail.com";

// Add numbers in international format without spaces, for example: +919876543210.
// Cards remain visible but inactive until the temple committee confirms the official numbers.
const contactNumbers: { phone: string | null; whatsapp: string | null } = {
  phone: null,
  whatsapp: null,
};

export const TEMPLE_PHONE = contactNumbers.phone;
export const TEMPLE_WHATSAPP = contactNumbers.whatsapp;
export const TEMPLE_PHONE_URL = contactNumbers.phone ? `tel:${contactNumbers.phone}` : null;
export const TEMPLE_WHATSAPP_URL = contactNumbers.whatsapp
  ? `https://wa.me/${contactNumbers.whatsapp.replace(/\D/g, "")}`
  : null;
