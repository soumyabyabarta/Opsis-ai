/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          dark: '#047857',
          light: '#D1FAE5',
          border: '#A7F3D0',
        },
        surface: '#FFFFFF',
        bg: '#F0FDF4',
        text: {
          DEFAULT: '#111827',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(16, 185, 129, 0.08)',
        card: '0 2px 16px rgba(0,0,0,0.06)',
        glow: '0 0 40px rgba(16,185,129,0.18)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 27% 37%, #d1fae5 0px, transparent 50%), radial-gradient(at 97% 21%, #a7f3d0 0px, transparent 50%), radial-gradient(at 52% 99%, #ecfdf5 0px, transparent 50%), radial-gradient(at 10% 29%, #f0fdf4 0px, transparent 50%)',
        'hero-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,244,0.8) 100%)',
        'cta-gradient': 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'score-fill': 'scoreFill 1.5s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scoreFill: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--dash-offset)' },
        },
      },
    },
  },
  plugins: [],
};
