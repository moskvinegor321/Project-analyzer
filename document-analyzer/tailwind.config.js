/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          subtle: 'hsl(var(--card-subtle))',
        },
        // KATALOG Media Colors
        'media-movie': 'hsl(var(--color-media-movie))',
        'media-tv': 'hsl(var(--color-media-tv))',
        'media-book': 'hsl(var(--color-media-book))',
        'media-album': 'hsl(var(--color-media-album))',
        // KATALOG Status Colors
        'status-success': 'hsl(var(--color-status-success))',
        'status-warning': 'hsl(var(--color-status-warning))',
        'status-error': 'hsl(var(--color-status-error))',
        'status-info': 'hsl(var(--color-status-info))',
        // KATALOG Surface Colors
        'surface-base': 'hsl(var(--color-surface-base))',
        'surface-elevated': 'hsl(var(--color-surface-elevated))',
        'surface-overlay': 'hsl(var(--color-surface-overlay))',
        'surface-subtle': 'hsl(var(--color-surface-subtle))',
        'surface-accent': 'hsl(var(--color-surface-accent))',
        // KATALOG Content Colors
        'content-primary': 'hsl(var(--color-content-primary))',
        'content-secondary': 'hsl(var(--color-content-secondary))',
        'content-tertiary': 'hsl(var(--color-content-tertiary))',
        'content-inverse': 'hsl(var(--color-content-inverse))',
        'content-disabled': 'hsl(var(--color-content-disabled))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        'heading': ['var(--font-spectral)', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
  safelist: [
    // Media colors
    'text-media-movie',
    'text-media-tv', 
    'text-media-book',
    'text-media-album',
    'bg-media-movie',
    'bg-media-tv',
    'bg-media-book', 
    'bg-media-album',
    'bg-media-movie/10',
    'bg-media-tv/10',
    'bg-media-book/10',
    'bg-media-album/10',
    'bg-media-movie/20',
    'bg-media-tv/20',
    'bg-media-book/20',
    'bg-media-album/20',
    'from-media-movie',
    'from-media-tv',
    'from-media-book',
    'from-media-album',
    'to-media-movie',
    'to-media-tv',
    'to-media-book',
    'to-media-album',
    // Status colors
    'text-status-success',
    'text-status-info',
    'bg-status-success',
    'bg-status-info',
    'bg-status-success/5',
    'bg-status-success/10',
    'bg-status-success/20',
    'border-status-success/20',
  ],
}; 