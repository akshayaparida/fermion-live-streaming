/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🎓 Professional Education Brand
        primary: {
          50: '#eff6ff',   // Very light blue
          100: '#dbeafe',  // Light blue
          200: '#bfdbfe',  // Soft blue
          300: '#93c5fd',  // Medium blue
          400: '#60a5fa',  // Bright blue
          500: '#3b82f6',  // Main brand blue (trustworthy, professional)
          600: '#2563eb',  // Hover blue
          700: '#1d4ed8',  // Active blue
          800: '#1e40af',  // Dark blue
          900: '#1e3a8a',  // Very dark blue
        },
        
        // 🌿 Success/Learning Green
        success: {
          50: '#f0fdf4',   // Very light green
          100: '#dcfce7',  // Light green
          200: '#bbf7d0',  // Soft green
          300: '#86efac',  // Medium green
          400: '#4ade80',  // Bright green
          500: '#22c55e',  // Main success green
          600: '#16a34a',  // Hover green
          700: '#15803d',  // Active green
          800: '#166534',  // Dark green
          900: '#14532d',  // Very dark green
        },
        
        // ⚠️ Warning/Attention Orange
        warning: {
          50: '#fffbeb',   // Very light orange
          100: '#fef3c7',  // Light orange
          200: '#fde68a',  // Soft orange
          300: '#fcd34d',  // Medium orange
          400: '#fbbf24',  // Bright orange
          500: '#f59e0b',  // Main warning orange
          600: '#d97706',  // Hover orange
          700: '#b45309',  // Active orange
          800: '#92400e',  // Dark orange
          900: '#78350f',  // Very dark orange
        },
        
        // 🔴 Error/Live Red
        error: {
          50: '#fef2f2',   // Very light red
          100: '#fee2e2',  // Light red
          200: '#fecaca',  // Soft red
          300: '#fca5a5',  // Medium red
          400: '#f87171',  // Bright red
          500: '#ef4444',  // Main error red
          600: '#dc2626',  // Hover red
          700: '#b91c1c',  // Active red
          800: '#991b1b',  // Dark red
          900: '#7f1d1d',  // Very dark red
        },
        
        // 🌫️ Professional Grays
        gray: {
          50: '#f9fafb',   // Very light gray
          100: '#f3f4f6',  // Light gray
          200: '#e5e7eb',  // Soft gray
          300: '#d1d5db',  // Medium light gray
          400: '#9ca3af',  // Medium gray
          500: '#6b7280',  // Main gray
          600: '#4b5563',  // Dark gray
          700: '#374151',  // Very dark gray
          800: '#1f2937',  // Near black
          900: '#111827',  // Black
        },
        
        // 📚 Educational Status Colors
        status: {
          live: '#dc2626',     // Professional red
          recording: '#f59e0b', // Professional orange
          offline: '#6b7280',   // Professional gray
          success: '#16a34a',   // Professional green
          info: '#2563eb',      // Professional blue
        },
      },
      animation: {
        // 📚 Professional, subtle animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out',
      },
      
      // 🎯 Professional Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}; 