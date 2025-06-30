// Standardized gradient patterns for the application
export const GRADIENTS = {
  // Primary brand gradients
  PRIMARY: 'linear-gradient(to right, #009ffd, #2a2a72)',
  PRIMARY_TO_BR: 'linear-gradient(to right bottom, rgba(41, 152, 255, 0.85), rgba(42, 42, 114, 0.75))',
  PRIMARY_DARK: 'linear-gradient(to right bottom, rgba(41, 152, 255), rgba(42, 42, 114))',
  
  // Background gradients
  BG_PRIMARY: 'bg-gradient-to-br from-[#3a8fff] via-[#009ffd] to-[#2a2a72]',
  BG_PRIMARY_OVERLAY: 'bg-gradient-to-br from-[#009ffd]/30 via-[#3a8fff]/20 to-[#2a2a72]/80',
  BG_DARK: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  
  // Button gradients
  BTN_PRIMARY: 'bg-gradient-to-r from-cyan-400 to-blue-700',
  BTN_PRIMARY_HOVER: 'hover:from-cyan-500 hover:to-blue-800',
  BTN_SECONDARY: 'bg-gradient-to-r from-[#009ffd] to-[#3a8fff]',
  BTN_SECONDARY_HOVER: 'hover:from-[#3a8fff] hover:to-[#009ffd]',
  
  // Text gradients
  TEXT_PRIMARY: 'linear-gradient(to right, #009ffd, #2a2a72)',
  TEXT_WHITE: 'linear-gradient(to right, #fff, #aee2ff)',
  
  // Product card gradients
  CARD_OVERLAY: 'linear-gradient(to right bottom, rgba(41, 152, 255, 0.7), rgba(86, 67, 250, 0.7))',
  
  // Special gradients
  GLASS_PRIMARY: 'linear-gradient(135deg, #3af0fc 0%, #2a2a72 100%)',
};

// CSS custom properties that can be used directly
export const CSS_GRADIENTS = {
  PRIMARY: 'var(--primary-gradient)',
  DARK_PRIMARY: 'var(--dark-primary-gradient)',
  SECONDARY: 'var(--secondary-gradient)',
  BRIGHT_SECONDARY: 'var(--bright-secondary-gradient)',
};

// Helper function to get gradient CSS
export const getGradient = (gradientKey) => {
  return GRADIENTS[gradientKey] || gradientKey;
};

// Helper function to get Tailwind gradient classes
export const getTailwindGradient = (gradientKey) => {
  const tailwindGradients = {
    BG_PRIMARY: GRADIENTS.BG_PRIMARY,
    BG_PRIMARY_OVERLAY: GRADIENTS.BG_PRIMARY_OVERLAY,
    BG_DARK: GRADIENTS.BG_DARK,
    BTN_PRIMARY: `${GRADIENTS.BTN_PRIMARY} ${GRADIENTS.BTN_PRIMARY_HOVER}`,
    BTN_SECONDARY: `${GRADIENTS.BTN_SECONDARY} ${GRADIENTS.BTN_SECONDARY_HOVER}`,
  };
  
  return tailwindGradients[gradientKey] || gradientKey;
};