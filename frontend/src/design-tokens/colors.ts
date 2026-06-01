/**
 * Enterprise Color Tokens
 * 
 * Centralized JS representation of our CSS `index.css` theme.
 * Keeps JS-level animations (Framer) and CSS-level styling synchronized.
 */
export const COLOR_TOKENS = Object.freeze({
  luxury: {
    gold: '#D4AF37',
    charcoal: '#1C1C1C',
    surface: '#2A2A2A',
    surfaceLight: '#3A3A3A',
  },
  text: {
    primary: '#fcfcfc',
    secondary: '#a0a0a0',
    muted: '#6b6b6b'
  },
  status: {
    error: '#FF4C4C',
    warning: '#FFAA00',
    success: '#00D166',
    info: '#0088FF'
  },
  overlay: {
    dark: 'rgba(28, 28, 28, 0.85)',
    glass: 'rgba(42, 42, 42, 0.6)'
  }
});
