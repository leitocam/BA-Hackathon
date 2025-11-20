import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // MusiciUS Brand Colors
        musicus: {
          // Backgrounds
          'bg-primary': '#000000',
          'bg-secondary': '#1C1C1E',
          'bg-tertiary': '#2C2C2E',
          'bg-elevated': '#3A3A3C',
          
          // Accents (Apple Music inspired)
          'accent-primary': '#FC3C44',
          'accent-secondary': '#F94C57',
          'accent-tertiary': '#FF375F',
          'accent-pink': '#FF6B9D',
          
          // Text
          'text-primary': '#FFFFFF',
          'text-secondary': '#C2CAD7',
          'text-tertiary': '#8E8E93',
          'text-disabled': '#48484A',
          
          // States
          'success': '#34C759',
          'warning': '#FF9500',
          'error': '#FF3B30',
        },
        
        // Light mode (optional)
        light: {
          'bg-primary': '#FFFFFF',
          'bg-secondary': '#F2F2F7',
          'bg-tertiary': '#E5E5EA',
          'text-primary': '#000000',
          'text-secondary': '#3C3C43',
          'text-tertiary': '#8E8E93',
        }
      },
      
      backgroundImage: {
        // Gradientes musicales
        'gradient-music': 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
        'gradient-music-subtle': 'linear-gradient(135deg, rgba(252, 60, 68, 0.1) 0%, rgba(249, 76, 87, 0.05) 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1C1C1E 0%, #000000 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(252, 60, 68, 0.08) 0%, rgba(249, 76, 87, 0.04) 100%)',
      },
      
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'Nunito Sans', 'sans-serif'],
      },
      
      fontSize: {
        // Mobile-first typography
        'hero': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title': ['24px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading': ['18px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'small': ['11px', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
      },
      
      spacing: {
        // Sistema de spacing base 4px
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      
      borderRadius: {
        'musicus-sm': '8px',
        'musicus-md': '12px',
        'musicus-lg': '16px',
        'musicus-xl': '20px',
        'musicus-2xl': '24px',
        'musicus-full': '9999px',
      },
      
      boxShadow: {
        'musicus-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.2)',
        'musicus-md': '0 4px 16px -4px rgba(0, 0, 0, 0.3)',
        'musicus-lg': '0 8px 24px -6px rgba(0, 0, 0, 0.4)',
        'musicus-xl': '0 12px 32px -8px rgba(0, 0, 0, 0.5)',
        'musicus-accent': '0 8px 24px -6px rgba(252, 60, 68, 0.5)',
        'musicus-accent-lg': '0 12px 32px -8px rgba(252, 60, 68, 0.7)',
      },
      
      backdropBlur: {
        'musicus': '20px',
        'musicus-lg': '40px',
      },
      
      animation: {
        'fadeInUp': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scalePop': 'scalePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulseSubtle': 'pulseSubtle 2s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scalePop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(200%)' },
        },
      },
      
      transitionDuration: {
        'musicus': '300ms',
      },
      
      transitionTimingFunction: {
        'musicus': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
