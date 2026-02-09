
export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 30,
      heavy: 60
    };
    navigator.vibrate(patterns[style]);
  }
};
